import Vue from 'vue'

export interface DialogType extends Vue {
 open (title: string, message: string, options: any): Promise<any>
}
