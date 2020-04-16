import Vue from 'vue'

export interface ConfirmDialogType extends Vue {
 open (title: string, message: string, options: any): Promise<any>
}
