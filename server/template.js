export default function template(body) {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <title>Pro MERN Stack</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <!-- Page generated from template. -->
  <div id="contents">${body}</div>
</body>
</html>
`;
}
