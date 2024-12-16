# CMP_Method

## Przygotowanie po pobraniu plików

1. **Pobierz wersję npm ≥ 20.***  
   Upewnij się, że masz zainstalowaną wersję `npm` 20 lub wyższą. Jeśli nie, zaktualizuj ją.

2. **Sprawdzenie wersji za pomocą NVM**  
   Jeśli używasz **NVM** (Node Version Manager), upewnij się, że masz ustawioną wersję `20.*`. Możesz to zrobić za pomocą poniższego polecenia:

   ```bash
   nvm use 20.*
3. **Instalacja zależności**  
   W katalogu projektu uruchom polecenie, aby zainstalować wszystkie niezbędne zależności:

   ```bash
   npm install

4. **Skrypty**

&nbsp;&nbsp;&nbsp;&nbsp;**`npm run watch`**  
&nbsp;&nbsp;&nbsp;&nbsp;Zbudowanie aplikacji w trybie **Dev** oraz aktualizowanie jej dynamicznie.  
&nbsp;&nbsp;&nbsp;&nbsp;(Należy uruchomić ten skrypt w osobnym oknie terminala).

&nbsp;&nbsp;&nbsp;&nbsp;**`npm run build`**  
&nbsp;&nbsp;&nbsp;&nbsp;Zbudowanie aplikacji na **produkcję**.

&nbsp;&nbsp;&nbsp;&nbsp;**`npm run start`**  
&nbsp;&nbsp;&nbsp;&nbsp;Uruchomienie aplikacji w trybie **Dev**.

&nbsp;&nbsp;&nbsp;&nbsp;**`npm run dist`**  
&nbsp;&nbsp;&nbsp;&nbsp;Utworzenie plików uruchomieniowych dla **Windows** oraz **Linux** w katalogu `dist-electron`.


