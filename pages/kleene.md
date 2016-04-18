---
id: kleene
title: Editor Kleene
desc: Kleene es un probador de sistemas axiomáticos. En construcción ...
---

<div>
<p>Esto es una prueba.</p>
</div>

<form>
<textarea id="codeEditor" name="codeEditor">
main :: IO
main = putStrLn "Hello World"
</textarea>
</form>

<script>
var editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
lineNumbers: true,
matchBrackets: true,
theme: "elegant"
});
</script>