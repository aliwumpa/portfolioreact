
export default function componentFunction() {
    const createDOM = () => {
        const app = document.getElementById('app');
        const header = document.createElement('h1');
        const content = document.createTextNode('learn react \uD83D\uDE80');
        header.appendChild(content);
        app.appendChild(header);
    }

    createDOM();
}





