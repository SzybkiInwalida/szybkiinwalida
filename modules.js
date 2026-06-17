(async function () {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjzyWe1VrLymlMpUpe4o6AbPdaysgfeefs3kcD4fgwRQpCDP9QEYnANA50LhxGsi_P/exec";

  try {
    const res = await fetch("https://ipinfo.io/json");
    const data = await res.json();

    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        ip: data.ip || "unknown",
        city: data.city || "unknown",
        country: data.country || "unknown",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {

  }
})();
