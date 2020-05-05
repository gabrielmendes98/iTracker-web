import serialize from 'serialize-javascript';

export default function template(body, data) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <title>Issue Tracker | MERN stack</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <!-- Page generated from template. -->
  <div id="contents">${body}</div>

  <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
  <script src="/env.js"></script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>
</body>
</html>
`;
}
