# Wetter

Android-App (Capacitor) mit Wetter und Regenradar, Daten vom Deutschen Wetterdienst.

- `web/` ist die App-Oberfläche. Sie wird über GitHub Pages veröffentlicht, und die App lädt sie bei jedem Start. Änderungen hier kommen ohne Neuinstallation an. Die Seite ist auch als Web-App (PWA) installierbar, z. B. auf dem iPhone über „Zum Home-Bildschirm“.
- Aktuelles Wetter, DWD-Unwetterwarnungen und Vorhersage (MOSMIX) über [Bright Sky](https://brightsky.dev), Niederschlagsradar direkt vom [DWD GeoServer](https://maps.dwd.de).
- Die APK steht unter Releases → „Wetter App“ → `Wetter.apk`.
- Der zuletzt gewählte Ort liegt nur auf dem Handy (localStorage).
- `signing/app.keystore` sorgt dafür, dass jede APK dieselbe Signatur hat. So lassen sich neue Versionen über die installierte App installieren.
