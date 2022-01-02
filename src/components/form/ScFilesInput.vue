<template>
  <div class="sc-form-field sc-files">
    <div class="label">
      <slot></slot>
    </div>
    <div v-if="!modelValue?.length">Keine Dateien ausgewählt</div>
    <template v-else>
      <div class="sc-file" v-for="(file, index) in files">
        <div class="preview files">
          <div class="paths">
            <template v-for="dir in file.path">
              <span>{{ dir }}</span>
              <svg viewBox="0 0 31 50" class="separator-icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"
                   style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M5.875 0 0 5.875 19.083 25 0 44.125 5.875 50l25-25-25-25z" style="fill-rule:nonzero"/></svg>
            </template>
          </div>
          <div class="filename">{{ file.file }}</div>
        </div>
        <div class="close" @click="remove(index)">
          <i class="material-icons">close</i>
        </div>
      </div>

    </template>
    <button class="add" @click="add">
      <i class="material-icons">add</i>
    </button>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {remote} from "electron";

const dialog = remote.dialog

export default defineComponent({
  name: "ScFilesInput",
  props: ['modelValue', 'options'],
  setup(props, {emit}) {

    function add() {
      dialog.showOpenDialog(remote.getCurrentWindow(), {
        buttonLabel: 'Hinzufügen',
        message: 'mycustommessage',
        properties: props.options || ["openFile", "multiSelections", "dontAddToRecent"]
      }).then(result => {
        if (result.canceled === false) {
          console.log("[ScFilesInput] Selected file paths:", result.filePaths)
          const filteredFiles = result.filePaths.filter(file => !props.modelValue.includes(file));
          // props.modelValue.push(...filteredFiles);
          emit('update:modelValue', props.modelValue.concat(filteredFiles));
        }
      }).catch(err => {
        console.log(err)
      })
    }

    const files = computed(() => {
      return props.modelValue.map(file => {
        const parts = file.split('\\');
        return {
          file: parts[parts.length - 1],
          path: parts.slice(0, -1)
        }
      })
    })

    function remove(index: number) {
      const arrCopy = props.modelValue.slice();
      arrCopy.splice(index, 1);
      emit('update:modelValue', arrCopy);
    }

    return {add, files, remove};
  }
});
</script>

<style scoped>
.sc-files {
  display: flex;
  flex-direction: column;
}

.sc-files .add {
  cursor: pointer;
  display: block;
  border: none;
  background-color: var(--primary);
  margin: 4px;
  border-radius: 4px;
  color: white;
  line-height: 0;
}

.sc-files .add i {
  font-size: 16px;
}

.sc-file {
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  margin: 4px;
  padding: 4px;
  background-color: var(--background-color-darker1);
}

.sc-file .files {
  flex: 1 1 auto;
}

.sc-file .close {
  flex: 0 0 auto;
  background-color: var(--error);
  border-radius: 50%;
  align-self: center;
  line-height: 0;
  padding: 2px;
  cursor: pointer;
}

.sc-file .close i {
  font-size: 20px;
}
</style>