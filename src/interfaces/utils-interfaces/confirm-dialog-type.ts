import { Vue } from 'vue-property-decorator'

export interface ConfirmDialogType extends Vue {
 open (title: string, message: string, options: any): Promise<boolean>
}
