import Swal from 'sweetalert2'

export const showSuccess = (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    confirmButtonColor: '#7c3aed',
  })
}

export const showError = (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#7c3aed',
  })
}

export const showConfirm = async (message: string): Promise<boolean> => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Are you sure?',
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
  })
  return result.isConfirmed
}
