const progress = document.querySelector(".scroll-progress");
const progressBar = progress.querySelector("span");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progressBar.style.transform = `scaleX(${value})`;
  progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

const experienceDialog = document.getElementById("experience-dialog");

if (experienceDialog) {
  const dialogTitle = experienceDialog.querySelector("#experience-dialog-title");
  const dialogOrg = experienceDialog.querySelector(".experience-dialog-org");
  const dialogDate = experienceDialog.querySelector(".experience-dialog-date");
  const dialogPlace = experienceDialog.querySelector(".experience-dialog-place");
  const dialogList = experienceDialog.querySelector(".experience-dialog-list");
  let lastTrigger = null;

  function openDetail(card) {
    const template = document.getElementById(`detail-${card.dataset.detail}`);
    const trigger = card.querySelector(".role-open");
    if (!template || !trigger) return;

    const title = card.querySelector("h3, .lead-role");
    dialogTitle.textContent = title.textContent.replace(/\s+/g, " ").trim();
    const org = card.querySelector(".org, .lead-org");
    dialogOrg.textContent = org ? org.textContent.trim() : "";
    dialogOrg.className = org && org.classList.contains("org")
      ? `experience-dialog-org ${org.className}`
      : "experience-dialog-org";
    const date = card.querySelector(".role-date, .lead-date");
    dialogDate.textContent = date ? date.textContent.trim() : "";
    const place = card.querySelector(".role-place");
    dialogPlace.textContent = place ? place.textContent.trim() : "";
    dialogPlace.hidden = !dialogPlace.textContent;
    dialogList.replaceChildren(template.content.cloneNode(true));

    lastTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    if (!experienceDialog.open) experienceDialog.showModal();
  }

  document.querySelectorAll(".role[data-detail], .lead[data-detail]").forEach((card) => {
    const trigger = card.querySelector(".role-open");
    if (trigger) {
      trigger.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
    }
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      openDetail(card);
    });
  });

  experienceDialog.querySelector("[data-close]").addEventListener("click", () => {
    experienceDialog.close();
  });

  experienceDialog.addEventListener("click", (event) => {
    if (event.target === experienceDialog) experienceDialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (!experienceDialog.open || event.key !== "Escape") return;
    event.preventDefault();
    experienceDialog.close();
  });

  experienceDialog.addEventListener("close", () => {
    const trigger = lastTrigger;
    if (!trigger) return;
    trigger.setAttribute("aria-expanded", "false");
    window.setTimeout(() => trigger.blur(), 0);
  });
}
