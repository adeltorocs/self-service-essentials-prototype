## Important to read prior to taking action

### Frontend components
Usability is important to this project and for our users. This prototype/project must use the paragon library and it's components to build all the UX/UI for this prototype. Here is more information about paragon:
- https://github.com/openedx/paragon
- https://paragon-openedx.netlify.app/

### Identifying back end impplementation points
We would like for this prototype to serve as an implementation example for our engineering teams. Please comment/annotate the javascript/react files in the places where the back end implementation should be integrated.

### Front end architecture
Read the 'enterprise-frontend-arch-patterns.md' to understand the current frontend architectural patterns

### Instructions
Build a static prototype that:
- Uses mocked data (no real API calls); use inline `const` fixtures or a `/mocks` folder
- Requires no backend to run (`npm start` should work out of the box)
- Organizes code following the patterns in `enterprise-frontend-arch-patterns.md` 
  (if this file is missing, stop and ask before proceeding)
- Uses Paragon v[X] components exclusively for all UI — no custom CSS unless Paragon has no equivalent
- Annotates every mock with a comment: `// BACKEND: replace with <description of real API call>`
- Entry point: `src/index.jsx`, main view: `src/App.jsx`