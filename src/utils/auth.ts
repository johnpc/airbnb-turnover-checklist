import { updatePassword, deleteUser } from 'aws-amplify/auth'

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await updatePassword({ oldPassword, newPassword })
}

export const deleteAccount = async (): Promise<void> => {
  await deleteUser()
}
