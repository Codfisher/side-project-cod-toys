import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export const use{{pascalCase name}}Store = defineStore('{{kebabCase name}}', ()=>{
  const data = ref('codfish');
  
  return {
    data,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(use{{pascalCase name}}Store, import.meta.hot))
}