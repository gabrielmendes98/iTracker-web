import serialize from 'serialize-javascript';
import dotenv from 'dotenv';

dotenv.config();

export default function template(body, initialData, userData) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <title>Issue Tracker | MERN stack</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js">
  </script>
  <script src="https://apis.google.com/js/client:platform.js?onload=start" async defer>
  </script>
  <script>
    function start() {
      gapi.load('auth2', function() {
        auth2 = gapi.auth2.init({
          client_id: '${process.env.GOOGLE_CLIENT_ID}',
        });
      });
    }
  </script>
</head>
<body>
  <!-- Page generated from template. -->
  <div id="contents">${body}</div>

  <script>
    window.__INITIAL_DATA__ = ${serialize(initialData)}
    window.__USER_DATA__ = ${serialize(userData)}
  </script>
  <script src="/env.js"></script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>
</body>
</html>
`;
}
