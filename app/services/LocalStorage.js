const TOKEN_KEY = 'token';
const EMAIL_KEY = 'email';
const SEARCH_KEY = 'search';

class LS {
    
    GetToken() {
        const token = localStorage.getItem(TOKEN_KEY);
        const email = localStorage.getItem(EMAIL_KEY);
        return { token, email };
    }


    SetToken(token, email) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EMAIL_KEY, email);
    }


    RemoveToken() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
    }


    CreateAuthHeader = () => {
        return {
            headers: {
                authorization: this.GetToken().token
            }
        };
    }


    SaveSearch(state, props) {
        localStorage.setItem(SEARCH_KEY, JSON.stringify({ state, props }));
    }


    GetSavedSearch() {
        const savedSearch = localStorage.getItem(SEARCH_KEY);
        if (savedSearch) {
            try {
                return JSON.parse(savedSearch);
            }            
            catch(err) {
                return null;
            }
        }

        return savedSearch;   
    }


    removeSavedSearch() {
        localStorage.removeItem(SEARCH_KEY);
    }
}


export default new LS();