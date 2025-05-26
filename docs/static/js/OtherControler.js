document.addEventListener('DOMContentLoaded', () => {
    const selectedBackground = localStorage.getItem('selectedBackground');
    if (selectedBackground) {
        document.getElementById('bodyId').style.backgroundImage = `url(${selectedBackground})`;
        document.getElementById('bodyId').style.backgroundSize = 'cover';
        document.getElementById('bodyId').style.backgroundRepeat = 'no-repeat';
    }
});
