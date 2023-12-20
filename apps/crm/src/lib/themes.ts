import { RaThemeOptions, defaultTheme } from "react-admin";

export const lightTheme: RaThemeOptions = defaultTheme;

export const darkTheme: RaThemeOptions = {
  ...defaultTheme,
  palette: {
    mode: 'dark'
  }
}