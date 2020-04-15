import { ADD_USER } from "../../constants/action-types";

const forbiddenWords = ["spam", "money"];

export function forbiddenUserMiddleware({ dispatch }) {
    return function (next) {
        return function (action) {
            // do your stuff
            if (action.type === ADD_USER) {

                const foundWord = forbiddenWords.filter(word =>
                    action.payload.title.includes(word)
                );

                if (foundWord.length) {
                    return dispatch({ type: "FOUND_BAD_WORD" });
                }
            }
            return next(action);
        };
    };
}