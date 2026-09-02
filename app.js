(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.getElementById("waitlist");
  const email = document.getElementById("email");
  const hint = document.getElementById("hint");
  const submit = document.getElementById("submit");
  const endpoint = (window.ADVOGUE && window.ADVOGUE.waitlistEndpoint) || "";

  function setHint(text, kind) {
    hint.textContent = text;
    hint.classList.remove("ok", "err");
    if (kind) hint.classList.add(kind);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const value = String(email.value || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setHint("Informe um e-mail válido.", "err");
      email.focus();
      return;
    }
    if (!endpoint) {
      setHint("Lista de espera ainda não configurada.", "err");
      return;
    }

    submit.disabled = true;
    setHint("Enviando…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: value,
          _subject: "Lista de espera Advogue.ai",
          _template: "table",
          _captcha: "false",
          source: "advogue.ai",
        }),
      });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      form.reset();
      setHint("Você está na lista. Avisamos quando abrir o piloto.", "ok");
    } catch (err) {
      setHint("Não foi possível enviar agora. Tente de novo em instantes.", "err");
    } finally {
      submit.disabled = false;
    }
  });
})();
