const english = {
  skip: "Skip to content",
  navEthos: "Philosophy",
  navJournal: "Field notes",
  heroEyebrow: "ABEL’S DIGITAL ATELIER / AI MENTOR PERSONA",
  heroOne: "Calm on the surface.",
  heroTwo: "Depth in every thought.",
  heroDesc:
    "Not every answer needs to arrive quickly. With Roxy, we untangle complexity, test the uncertain, and keep learning until things truly make sense.",
  cta: "Open the grimoire",
  heroNote: "A little curiosity. Plenty of room to grow.",
  artCaption: "Inspired by a character. Brought to life as an idea.",
  heroFoot: "NOT A SHORTCUT. A THINKING COMPANION.",
  scroll: "Follow the current",
  ethosLabel: "01 / PHILOSOPHY",
  ethosTitle: "Deep knowledge,\na quiet ego.",
  ethosLead:
    "A good mentor does not take over your journey. She helps you read the map.",
  ethosBody:
    "Roxy is Abel’s fan-made AI persona: patient in explaining, careful in building, and honest about what she does not know. Not a human, not an official anime website, and not an infallible source.",
  ethosNote:
    "A small principle: verify answers, rather than simply trusting them.",
  grimoireLabel: "02 / GRIMOIRE",
  grimoireTitle: "Three paths. One curiosity.",
  grimoireIntro:
    "Not a collection of instant spells.\nTools for thinking more clearly.",
  tabBuild: "Engineering",
  tabResearch: "Research",
  tabLearn: "Learning",
  buildLabel: "SPELL 01 / FROM IDEA TO EVIDENCE",
  buildTitle: "Build small.\nTest for real.",
  buildBody:
    "Turn a large problem into pieces you can inspect. Start with one behavior, write its test, then build just enough to make it work.",
  buildPractice:
    "Try this: choose one fragile function. Write its failing case before fixing the code.",
  researchLabel: "SPELL 02 / TRACE BEFORE CONCLUDING",
  researchTitle: "Ask sharper questions.\nRead a little deeper.",
  researchBody:
    "Separate what is known from what is merely assumed. Trace original sources, compare evidence, and leave room to change your mind.",
  researchPractice:
    "Try this: take one claim. Find its primary source, then write down one thing the evidence does not explain.",
  learnLabel: "SPELL 03 / FAILURE IS A FIELD NOTE",
  learnTitle: "Not understanding yet\nis not being unable.",
  learnBody:
    "Explain an idea in your own words. Where the explanation falters, you have found your next place to learn.",
  learnPractice:
    "Try this: after an attempt, note what went wrong, why, and one change for the next experiment.",
  journalLabel: "03 / FIELD NOTES",
  journalTitle: "Progress often\nspeaks softly.",
  journalIntro:
    "Not a journal of perfect achievements. A way to return to the desk whenever something has not worked out yet.",
  handnote: "Try. Observe. Understand. Repeat.",
  step1: "Begin with a question.",
  step1Body:
    "What are you really trying to solve? Name the problem before reaching for a tool.",
  step2: "Let reality answer.",
  step2Body:
    "Make the smallest experiment. Keep the results, including those you did not expect.",
  step3: "Take understanding home.",
  step3Body:
    "Write down what changed in your thinking. Knowledge grows when you can explain it again.",
  closingLabel: "THERE IS STILL SO MUCH WE DO NOT KNOW.",
  closingTitle: "Good. Let’s start there.",
  github: "Explore Abel’s work",
  footerLine: "The Quiet Current — room to think, not to rush.",
  back: "Back to top ↑",
  disclaimer:
    "A fan-made project by Abel. An AI persona, not a real person. Not affiliated with the rights holders of Mushoku Tensei.",
  credit:
    "Roxy illustration: official Mushoku Tensei material; copyright belongs to the respective rights holders.",
  source: "Official source ↗",
  motionOff: "Motion: off",
  motionOn: "Motion: on",
};
const ariaEnglish = {
  home: "Roxy — home",
  nav: "Main navigation",
  art: "Roxy Migurdia wearing a black witch hat and blue braids, shown in full.",
  disciplines: "Learning disciplines",
  top: "Roxy — back to top",
};
const textNodes = [...document.querySelectorAll("[data-i]")];
const ariaNodes = [...document.querySelectorAll("[data-a]")];
// Snapshot the complete static baseline before any translation or panel hiding.
const indonesian = Object.fromEntries(
  textNodes.map((el) => [el.dataset.i, el.innerText]),
);
const ariaIndonesian = Object.fromEntries(
  ariaNodes.map((el) => [
    el.dataset.a,
    el.getAttribute(el.tagName === "IMG" ? "alt" : "aria-label"),
  ]),
);
const description = document.querySelector("meta[name=description]");
const originalDescription = description.content;
const originalTitle = document.title;
function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
}
let language = read("roxy-language") === "en" ? "en" : "id";
const languageButton = document.querySelector("#language");
function translate() {
  const dict = language === "en" ? english : indonesian;
  document.documentElement.lang = language;
  textNodes.forEach((el) => {
    if (dict[el.dataset.i] !== undefined) el.textContent = dict[el.dataset.i];
  });
  ariaNodes.forEach((el) =>
    el.setAttribute(
      el.tagName === "IMG" ? "alt" : "aria-label",
      (language === "en" ? ariaEnglish : ariaIndonesian)[el.dataset.a],
    ),
  );
  document.title =
    language === "en" ? "Roxy — The Quiet Current · AI mentor" : originalTitle;
  description.content =
    language === "en"
      ? "A learning space with Roxy, Abel’s fan-made AI mentor persona. Engineering, research, and the courage to try again."
      : originalDescription;
  languageButton.textContent = language === "en" ? "ID" : "EN";
  languageButton.lang = language === "en" ? "id" : "en";
  languageButton.setAttribute(
    "aria-label",
    language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English",
  );
}
languageButton.disabled = false;
languageButton.addEventListener("click", () => {
  language = language === "id" ? "en" : "id";
  translate();
  save("roxy-language", language);
});
translate();
// Progressive tabs: all panels remain readable until enhancement initializes.
const tablist = document.querySelector(".discipline-nav");
const horizontalTabs = matchMedia("(max-width: 650px)");
function orientTabs() {
  tablist.setAttribute(
    "aria-orientation",
    horizontalTabs.matches ? "horizontal" : "vertical",
  );
}
orientTabs();
horizontalTabs.addEventListener("change", orientTabs);
const tabs = [...tablist.querySelectorAll("a")];
const panels = tabs.map((tab) =>
  document.querySelector(tab.getAttribute("href")),
);
tablist.setAttribute("role", "tablist");
function selectTab(index) {
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
}
tabs.forEach((tab, i) => {
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panels[i].id);
  panels[i].setAttribute("role", "tabpanel");
  panels[i].setAttribute("aria-labelledby", tab.id);
  panels[i].tabIndex = 0;
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    selectTab(i);
  });
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (i + tabs.length - 1) % tabs.length;
    if (!horizontalTabs.matches && event.key === "ArrowDown")
      next = (i + 1) % tabs.length;
    if (!horizontalTabs.matches && event.key === "ArrowUp")
      next = (i + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (event.key === " ") {
      event.preventDefault();
      selectTab(i);
    }
    if (next !== undefined) {
      event.preventDefault();
      selectTab(next);
      tabs[next].focus();
    }
  });
});
function selectHash() {
  const index = panels.findIndex((panel) => "#" + panel.id === location.hash);
  if (index >= 0) selectTab(index);
}
selectTab(0);
selectHash();
window.addEventListener("hashchange", selectHash);
const motionButton = document.querySelector("#motion");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let motion = read("roxy-motion");
let motionEnabled = motion === "on" || (motion !== "off" && !reduced.matches);
let animation;
function updateMotion() {
  // Stored intent is separate from effective motion; system reduction wins.
  const active = motionEnabled && !reduced.matches;
  if (motionEnabled && reduced.matches) {
    motionButton.setAttribute(
      "aria-description",
      language === "en"
        ? "Your system requests reduced motion; animation remains paused despite the saved on preference."
        : "Pengaturan sistem mengurangi gerak; animasi tetap dijeda meskipun preferensi hidup tersimpan.",
    );
  } else motionButton.removeAttribute("aria-description");
  motionButton.setAttribute("aria-pressed", String(motionEnabled));
  motionButton.textContent =
    language === "en"
      ? motionEnabled
        ? "Motion: on"
        : "Motion: off"
      : motionEnabled
        ? "Gerak: hidup"
        : "Gerak: mati";
  document.documentElement.dataset.motion = active ? "on" : "off";
  if (!active) {
    animation?.cancel();
    animation = undefined;
    return;
  }
  if (!animation)
    animation = document
      .querySelector(".water-map")
      .animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(7px)" },
          { transform: "translateY(0)" },
        ],
        { duration: 9000, iterations: Infinity, easing: "ease-in-out" },
      );
  if (document.hidden) animation.pause();
  else animation.play();
}
motionButton.disabled = false;
motionButton.addEventListener("click", () => {
  motionEnabled = !motionEnabled;
  save("roxy-motion", motionEnabled ? "on" : "off");
  updateMotion();
});
languageButton.addEventListener("click", updateMotion);
reduced.addEventListener("change", updateMotion);
document.addEventListener("visibilitychange", updateMotion);
updateMotion();
