export default class UserList{
    constructor(element){
        this.element = element;
        this.items = new Set();
    }

    buildDom(){
        const fragment = document.createDocumentFragment();

        this.element.innerHTML = '';

        for(const name of this.items){
            const div = document.createElement('div');
            div.classList.add('user-list-item');
            div.textContent = name; 
            fragment.appendChild(div);
        }

        this.element.appendChild(fragment);
        
    }

    add(name){
        this.items.add(name);
        this.buildDom();
    }

    remove(name){
        this.items.delete(name);
        this.buildDom();
    }
}