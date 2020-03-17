import Vue from 'vue'

export interface DialogType extends Vue {
 open(title: String, message: String, options:any): Promise<any>
}
