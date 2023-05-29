export default {
  create: {
    success: {
      code: 'INSERT_DATA_SUCCESS',
      message: 'Tambah data sukses.',
    },
    fail: {
      code: 'INSERT_DATA_FAIL',
      message: 'Tambah data gagal.',
    },
  },
  update: {
    success: {
      code: 'UPDATE_DATA_SUCCESS',
      message: 'Ubah data sukses.',
    },
    fail: {
      code: 'UPDATE_DATA_FAIL',
      message: 'Ubah data gagal.',
    },
  },
  list: {
    success: {
      code: 'LIST_DATA_SUCCESS',
      message: 'Sukses mengambil data',
    },
    fail: {
      code: 'LIST_DATA_FAIL',
      message: 'Gagal mengambil data',
    },
  },
  delete: {
    success: {
      code: 'DELETE_DATA_SUCCESS',
      message: 'Sukses menghapus data.',
    },
    fail: {
      code: 'DELETE_DATA_FAIL',
      message: 'Gagal menghapus data.',
    },
  },
  get: {
    success: {
      code: 'GET_DATA_SUCCESS',
      message: 'Mengambil data sukses.',
    },
    fail: {
      code: 'GET_DATA_FAIL',
      message: 'Gagal mengambil data.',
    },
  },
  general: {
    success: {
      code: 'SUCCESS',
      message: 'Sukses',
    },
    dataSuccess: {
      code: 'GET_DATA_SUCCESS',
      message: 'Mengambil data sukses.',
    },
    fail: {
      code: 'FAIL',
      message: 'Gagal',
    },
    dataNotFound: {
      code: 'DATA_NOT_FOUND',
      message: 'Data tidak ditemukan.',
    },
    idNotFound: {
      code: 'ID_NOT_FOUND',
      message: 'Id tidak ditemukan.',
    },
    dataInvalid: {
      code: 'DATA_INVALID',
      message: 'Data tidak valid.',
    },
    dataIsEmpty: {
      code: 'DATA_IS_EMPTY',
      message: 'Data tidak boleh kosong.',
    },
    dataNotAllowed: {
      code: 'DATA_NOT_ALLOWED',
      message: 'Tidak dapat mengakses data ini.',
    },
    invalidUserAccess: {
      code: 'UNAUTHORIZED USER',
      message: 'User tidak mendapatkan akses.',
    },
    statusNotAllowed: {
      code: 'STATUS_NOT_ALLOWED',
      message: 'Tidak dapat mengupdate data pada status ini.',
    },
    imageNotModified: {
      code: 'IMAGE_NOT_MODIFIED',
      message: 'Image tidak berubah.',
    },
    invalidDate: {
      code: 'INVALID_DATE',
      message: 'Tanggal tidak valid.',
    },
    invalidStartEndDate: {
      code: 'INVALID_START_END_DATE',
      message: 'Tanggal mulai harus lebih kecil dari tanggal selesai.',
    },
    invalidGreaterDate: {
      code: 'INVALID_GREATER_DATE',
      message: 'Tanggal harus lebih besar dari sekarang.',
    },
    dateIsExist: {
      code: 'INVALID_GREATER_DATE',
      message:
        'Tanggal/jam mulai sudah digunakan, silahkan pilih tanggal yang berbeda.',
    },
  },
  redis: {
    createQueueFail: {
      code: 'CREATE_QUEUE_FAIL',
      message: 'Tidak dapat membuat queue',
    },
  },
};
