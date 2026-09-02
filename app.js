(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.getElementById("waitlist");
  const hint = document.getElementById("hint");
  const submit = document.getElementById("submit");
  const endpoint = (window.ADVOGUE && window.ADVOGUE.waitlistEndpoint) || "";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setHint(text, kind) {
    hint.textContent = text;
    hint.classList.remove("ok", "err");
    if (kind) hint.classList.add(kind);
  }

  function read(id) {
    const node = document.getElementById(id);
    return String(node && node.value ? node.value : "").trim();
  }

  function collect() {
    return {
      name: read("name"),
      email: read("email").toLowerCase(),
      oabs: read("oabs"),
      area: read("area"),
      lawyers: read("lawyers"),
      caseload: read("caseload"),
      source: "advogue.ai",
    };
  }

  function validate(data) {
    if (data.name.length < 2) {
      return "Informe o seu nome.";
    }
    if (!EMAIL_RE.test(data.email)) {
      return "Informe um e-mail válido.";
    }
    if (!data.area || !data.lawyers || !data.caseload) {
      return "Complete área, tamanho do escritório e volume de processos.";
    }
    return "";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = collect();
    const error = validate(data);
    if (error) {
      setHint(error, "err");
      return;
    }
    if (!endpoint || endpoint.includes("YOUR_EMAIL")) {
      setHint("O pedido ainda não está ligado. Tente de novo em breve.", "err");
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
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      form.reset();
      setHint("Pedido recebido. Entramos em contato para uma conversa curta.", "ok");
    } catch (err) {
      setHint("Não foi possível enviar agora. Tente de novo em instantes.", "err");
    } finally {
      submit.disabled = false;
    }
  });
})();
