document.addEventListener('DOMContentLoaded', () => {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems, {});    
    M.FormSelect.init(document.querySelectorAll('select'), {});
    CKEDITOR.replace("story", {
      plugins: "wysiwygarea, basicstyles, toolbar, link"
    });

  });