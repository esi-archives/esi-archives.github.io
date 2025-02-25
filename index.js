const cardsElements = document.getElementsByClassName("cards");
for (const cardsElement of cardsElements) {
    cardsElement.onmousemove = e => {
        for (const card of cardsElement.getElementsByClassName("card")) {
            const rect = card.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    }
}

const coursesElement = document.getElementsByClassName("courses")[0];
coursesElement.onmousemove = e => {
    for (const course of coursesElement.getElementsByClassName("course")) {
        const rect = course.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        course.style.setProperty("--mouse-x", `${x}px`);
        course.style.setProperty("--mouse-y", `${y}px`);
    }
}

for (const card of document.getElementsByClassName("card")) {
    card.onclick = () => {
        if (card.getAttribute("open") === "true") {
            card.setAttribute("open", "false");
        } else {
            card.setAttribute("open", "true");
        }
    }
}

for (const course of document.getElementsByClassName("course")) {
    course.onclick = () => {
        if (course.getAttribute("open") === "true") {
            course.setAttribute("open", "false");
        } else {
            course.setAttribute("open", "true");
        }
    }
}

let lightMode = localStorage.getItem('lightMode'); 

const lightModeToggle = document.querySelector('#light-mode-toggle');

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add('lightmode');
  // 2. Update lightMode in localStorage
  localStorage.setItem('lightMode', 'enabled');
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('lightmode');
  // 2. Update lightMode in localStorage 
  localStorage.setItem('lightMode', null);
}
 
// If the user already visited and enabled lightMode
// start things off with it on
if (lightMode === 'enabled') {
  enableDarkMode();
}

// When someone clicks the button
lightModeToggle.addEventListener('click', () => {
  // get their lightMode setting
  lightMode = localStorage.getItem('lightMode'); 
  
  // if it not current enabled, enable it
  if (lightMode !== 'enabled') {
    enableDarkMode();
  // if it has been enabled, turn it off  
  } else {  
    disableDarkMode(); 
  }
});

function applyFilters() {
    const yearFilter = document.getElementById('yearFilter').value.toUpperCase();
    const semesterFilter = document.getElementById('semesterFilter').value.toUpperCase();
    const courseFilter = document.getElementById('courseFilter').value.toUpperCase();
    const courses = document.querySelectorAll('.course');
    const searchText = document.querySelector('.search-text');
    searchText.style.display = 'none';

    // Check if all filters are empty
    if (yearFilter === '' && semesterFilter === '' && courseFilter === '') {
        courses.forEach(course => {
            course.style.display = 'none';
        });
        searchText.style.display = 'block';
        return;
    }

    courses.forEach(course => {
        const year = course.getAttribute('year').toUpperCase();
        const semester = course.getAttribute('semester').toUpperCase();
        const courseCode = course.getAttribute('code').toUpperCase();
        const courseName = course.getAttribute('course').toUpperCase();
        const speciality = course.getAttribute('speciality')?.toUpperCase() || '';

        course.style.display =
            ((year.includes(yearFilter) || speciality.includes(yearFilter)) || yearFilter === '') &&
            (semester.includes(semesterFilter) || semesterFilter === '') &&
            ((courseCode.includes(courseFilter) || courseName.includes(courseFilter)) || courseFilter === '')
            ? 'block' : 'none';
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = null;
    let maxVisibility = 0;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const sectionVisibility = visibleHeight / section.offsetHeight;
        
        // Update current section if this one has more visible area
        if (sectionVisibility > maxVisibility) {
            maxVisibility = sectionVisibility;
            currentSection = section;
        }
    });

    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.classList.remove('navbar-a-infocus');
        if (currentSection && link.getAttribute('href') === '#' + currentSection.id) {
            link.classList.add('navbar-a-infocus');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();

function scrollToActiveNavLink() {
    const navbarList = document.querySelector('.navbar ul');
    const activeLink = document.querySelector('.navbar-a-infocus');
    if (activeLink) {
        const navbarListRect = navbarList.getBoundingClientRect();
        const activeLinkRect = activeLink.getBoundingClientRect();
        const scrollLeft = activeLinkRect.left - navbarListRect.left - (navbarListRect.width / 2) + (activeLinkRect.width / 2);
        navbarList.scrollTo({
            left: scrollLeft + navbarList.scrollLeft,
            behavior: 'instant'
        });
    }
}

// Add this to the existing scroll event listener
window.addEventListener('scroll', scrollToActiveNavLink);

// Also call it after updateActiveNavLink updates the active link
const originalUpdateActiveNavLink = updateActiveNavLink;
updateActiveNavLink = function() {
    originalUpdateActiveNavLink();
    scrollToActiveNavLink();
};
