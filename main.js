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

  function openExperience(role) {
    const template = document.getElementById(`detail-${role.dataset.detail}`);
    const trigger = role.querySelector(".role-open");
    if (!template || !trigger) return;

    dialogTitle.textContent = role.querySelector("h3").textContent.trim();
    const org = role.querySelector(".org");
    dialogOrg.textContent = org.textContent.trim();
    dialogOrg.className = `experience-dialog-org ${org.className}`;
    dialogDate.textContent = role.querySelector(".role-date").textContent.trim();
    dialogPlace.textContent = role.querySelector(".role-place").textContent.trim();
    dialogList.replaceChildren(template.content.cloneNode(true));

    lastTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    if (!experienceDialog.open) experienceDialog.showModal();
  }

  document.querySelectorAll(".role[data-detail]").forEach((role) => {
    const trigger = role.querySelector(".role-open");
    if (trigger) {
      trigger.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
    }
    role.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      openExperience(role);
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
