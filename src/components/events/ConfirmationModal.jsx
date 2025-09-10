import Swal from 'sweetalert2';

const ConfirmationModal = {
  /**
   * Muestra un modal de confirmación personalizable
   * @param {Object} options - Opciones de configuración del modal
   * @param {string} options.title - Título del modal
   * @param {string} options.text - Texto descriptivo
   * @param {string} options.confirmButtonText - Texto del botón de confirmación
   * @param {string} options.icon - Icono a mostrar (success, error, warning, info, question)
   * @returns {Promise<boolean>} - Devuelve true si el usuario confirma
   */
  show: async ({
    title = '¿Confirmar acción?',
    text = '¿Estás seguro de que deseas realizar esta acción?',
    confirmButtonText = 'Confirmar',
    icon = 'question',
    disabled = false  // Recibimos disabled desde el componente
  }) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText: 'Cancelar'
    });

    // Accedemos al botón de confirmación y lo habilitamos/deshabilitamos
    const confirmButton = Swal.getConfirmButton();
    confirmButton.disabled = disabled;  // Deshabilitamos el botón si `disabled` es true

    return result.isConfirmed;
  },

  /**
   * Muestra un modal de éxito
   * @param {Object} options - Opciones de configuración
   * @param {string} options.title - Título del modal (default: '¡Éxito!')
   * @param {string} options.text - Texto descriptivo
   */
  showSuccess: async ({ title = '¡Éxito!', text = 'Operación realizada con éxito' }) => {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3085d6'
    });
  },

  /**
   * Muestra un modal de error
   * @param {Object} options - Opciones de configuración
   * @param {string} options.title - Título del modal (default: 'Error')
   * @param {string} options.text - Texto descriptivo
   */
  showError: async ({ title = 'Error', text = 'Ocurrió un error al realizar la operación' }) => {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33'
    });
  }
};

export default ConfirmationModal;