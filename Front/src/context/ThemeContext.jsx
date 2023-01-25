import {createContext,useState} from 'react';

const ThemeContext = createContext();

const initialTheme = "Claro";

const ThemeProvider = ({children}) => {

	const [theme,setTheme] = useState(initialTheme);

    const changeTheme = (e) => {

    	if(theme == "Claro") setTheme("Oscuro");
    	else setTheme("Claro");

	}

	const data = {

		theme,
		changeTheme

	}

	return (

		<ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>

	);

}

export default ThemeContext;
export {ThemeProvider};
