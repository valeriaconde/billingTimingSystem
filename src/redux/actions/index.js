import {
  ADD_ALERT,
  CLEAR_ALERT,
  ADD_CLIENT,
  ADD_PROJECT,
  CLIENTS_MAPPING_LOADED,
  LOADING_CLIENTS,
  LOADING_PROJECTS_MAPPING,
  PROJECTS_MAPPING_LOADED,
  REMOVED_CLIENT,
  REMOVED_PROJECT,
} from "../../constants/action-types";
import {
  CLIENTS,
  PROJECTS,
  MISC,
  CLIENTS_INDEX,
  PROJECTS_INDEX,
} from "../../constants/collections";
import { AlertType } from "../../stores/AlertStore";
import { db } from "../../components/firestone";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const successAlert = (dispatch, message) => {
  const alert = { type: AlertType.Success, message };
  dispatch({ type: ADD_ALERT, payload: alert });
  setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: alert }), 7000);
};

const errorAlert = (dispatch, error) => {
  dispatch({
    type: ADD_ALERT,
    payload: { type: AlertType.Error, message: error.message || error },
  });
};

const getFreshIndexDoc = async (indexRef) => {
  try {
    return await getDocFromServer(indexRef);
  } catch (error) {
    return getDoc(indexRef);
  }
};

const loadClientIndex = async (dispatch) => {
  const indexRef = doc(db, MISC, CLIENTS_INDEX);
  const indexDoc = await getFreshIndexDoc(indexRef);

  if (indexDoc.exists()) {
    dispatch({ type: CLIENTS_MAPPING_LOADED, payload: indexDoc.data() });
    return indexDoc.data();
  }

  const snapshot = await getDocs(collection(db, CLIENTS));
  const mapping = {};
  snapshot.forEach((clientDoc) => {
    mapping[clientDoc.id] = clientDoc.data().denomination;
  });

  await setDoc(indexRef, mapping);
  dispatch({ type: CLIENTS_MAPPING_LOADED, payload: mapping });
  return mapping;
};

const loadProjectIndex = async (dispatch) => {
  const indexRef = doc(db, MISC, PROJECTS_INDEX);
  const indexDoc = await getFreshIndexDoc(indexRef);

  if (indexDoc.exists()) {
    const data = indexDoc.data();
    const firstValue = Object.values(data)[0];

    if (firstValue !== undefined && typeof firstValue === "string") {
      dispatch({ type: PROJECTS_MAPPING_LOADED, payload: data });
      buildProjectsIndex(indexRef, dispatch).catch(() => {});
      return data;
    }

    dispatch({ type: PROJECTS_MAPPING_LOADED, payload: data });
    return data;
  }

  return buildProjectsIndex(indexRef, dispatch);
};

const upsertClientIndexEntry = async (dispatch, uid, denomination) => {
  const indexRef = doc(db, MISC, CLIENTS_INDEX);
  await setDoc(indexRef, { [uid]: denomination }, { merge: true });
  const mapping = await loadClientIndex(dispatch);
  dispatch({ type: CLIENTS_MAPPING_LOADED, payload: { ...mapping, [uid]: denomination } });
};

const upsertProjectIndexEntry = async (dispatch, uid, project) => {
  const payload = {
    [uid]: {
      title: project.projectTitle,
      clientUid: project.projectClient,
    },
  };
  const indexRef = doc(db, MISC, PROJECTS_INDEX);
  await setDoc(indexRef, payload, { merge: true });
  const mapping = await loadProjectIndex(dispatch);
  dispatch({ type: PROJECTS_MAPPING_LOADED, payload: { ...mapping, ...payload } });
};

async function buildProjectsIndex(indexRef, dispatch) {
  const querySnapshot = await getDocs(
    query(collection(db, PROJECTS), where("isOpen", "==", true)),
  );
  const mapping = {};

  querySnapshot.forEach((projectDoc) => {
    mapping[projectDoc.id] = {
      title: projectDoc.data().projectTitle,
      clientUid: projectDoc.data().projectClient,
    };
  });

  await setDoc(indexRef, mapping);
  dispatch({ type: PROJECTS_MAPPING_LOADED, payload: mapping });
  return mapping;
}

export function addAlert(type, message) {
  const payload = { type, message };

  return function(dispatch) {
    dispatch({ type: ADD_ALERT, payload });
    setTimeout(() => dispatch({ type: CLEAR_ALERT, payload }), 7000);
  };
}

export function addClient(payload) {
  return async function(dispatch) {
    dispatch({ type: LOADING_CLIENTS, payload: {} });

    try {
      const docRef = await addDoc(collection(db, CLIENTS), payload);
      const client = { ...payload, uid: docRef.id };

      await upsertClientIndexEntry(dispatch, docRef.id, payload.denomination);
      dispatch({ type: ADD_CLIENT, payload: client });
      successAlert(dispatch, "Client successfully registered.");
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function addProject(payload) {
  return async function(dispatch) {
    try {
      const docRef = await addDoc(collection(db, PROJECTS), payload);
      const project = { ...payload, uid: docRef.id };

      await upsertProjectIndexEntry(dispatch, docRef.id, payload);
      dispatch({ type: ADD_PROJECT, payload: project });
      successAlert(dispatch, "Project successfully created.");
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function updateClient(uid, payload) {
  return async function(dispatch) {
    dispatch({ type: LOADING_CLIENTS, payload: {} });

    try {
      const docRef = doc(db, CLIENTS, uid);
      await updateDoc(docRef, payload);

      if (payload.denomination) {
        await upsertClientIndexEntry(dispatch, uid, payload.denomination);
      }

      successAlert(dispatch, "Client successfully updated.");
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function updateProject(uid, payload) {
  return async function(dispatch) {
    try {
      const docRef = doc(db, PROJECTS, uid);
      await updateDoc(docRef, payload);

      if (payload.projectTitle || payload.projectClient) {
        const snapshot = await getFreshIndexDoc(docRef);
        await upsertProjectIndexEntry(dispatch, uid, snapshot.data());
      }

      successAlert(dispatch, "Project successfully updated.");
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function getClientsMapping() {
  return async function(dispatch) {
    try {
      await loadClientIndex(dispatch);
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function getProjectsMapping() {
  return async function(dispatch) {
    dispatch({ type: LOADING_PROJECTS_MAPPING, payload: {} });

    try {
      await loadProjectIndex(dispatch);
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function deleteClient(uid) {
  return async function(dispatch) {
    dispatch({ type: LOADING_CLIENTS, payload: {} });

    try {
      await deleteDoc(doc(db, CLIENTS, uid));
      await setDoc(doc(db, MISC, CLIENTS_INDEX), { [uid]: deleteField() }, { merge: true });
      dispatch({ type: REMOVED_CLIENT, payload: uid });
      await loadClientIndex(dispatch);
      successAlert(dispatch, "Client successfully deleted.");
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}

export function deleteProject(uid) {
  return async function(dispatch) {
    try {
      await deleteDoc(doc(db, PROJECTS, uid));
      await setDoc(doc(db, MISC, PROJECTS_INDEX), { [uid]: deleteField() }, { merge: true });
      dispatch({ type: REMOVED_PROJECT, payload: uid });
      await loadProjectIndex(dispatch);
    } catch (error) {
      errorAlert(dispatch, error);
    }
  };
}
