export default {
  general: {
    success: 'SUCCESS',
    countOverLimit: {
      code: 'COUNT_OVER_LIMIT',
      message: 'Jumlah Data Melebihi Batas Maksimum.',
    },
    countOverLimitOnboarding: {
      code: 'COUNT_ONBOARDING_OVER_LIMIT',
      message: 'Hanya bisa menambahkan maks. 5 onboarding.',
    },
    dataNotFound: {
      code: 'DATA_NOT_FOUND',
      message: 'Data Admin tidak ditemukan.',
    },
    cannotDeleteRole: {
      code: 'ROLE_STILL_USED',
      message: 'Role permission masih digunakan.',
    },
    emailExist: {
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email sudah terdaftar.',
    },
    emailNotFound: {
      code: 'EMAIL_NOT_FOUND',
      message: 'Email tidak ditemukan.',
    },
    fail: {
      code: 'FAIL_TRANSACTION',
      message: 'Transaksi Gagal.',
    },
    phoneNotFound: {
      code: 'PHONE_NOT_FOUND',
      message: 'Nomor Telepon tidak ditemukan.',
    },
    empty_photo: {
      code: 'IMAGE_NOT_FOUND',
      message: 'File image kosong.',
    },
    empty_token: 'Kode Token tidak ada.',
    idNotFound: {
      code: 'INVALID_ID',
      message: 'ID tidak ditemukan.',
    },
    invalidID: {
      code: 'INVALID_ID',
      message: 'ID tidak valid.',
    },
    invalidUUID: {
      code: 'INVALID_UUID',
      message: 'UUID tidak valid.',
    },
    invalidValue: {
      code: 'INVALID_VALUE',
      message: 'Value tidak sesuai.',
    },
    invalid_token: 'Kode Token tidak valid.',
    nameExist: {
      code: 'NAME_ALREADY_EXISTS',
      message: 'Nama sudah digunakan.',
    },
    phoneExist: {
      code: 'PHONE_ALREADY_EXISTS',
      message: 'Nomor Telepon sudah digunakan.',
    },
    rolePlatformNotMatch: {
      code: 'PLATFORM_NOT_MATCH',
      message: 'Platform Role tidak sesuai.',
    },
    storeIdNotMatch: {
      code: 'STORE_ID_NOT_MATCH',
      message: 'Store ID bukan milik merchant.',
    },
    unactivedUser: {
      code: 'USER_NOT_ACTIVE',
      message: 'User Tidak Aktif.',
    },
    unregistered_user: {
      code: 'UNREGISTERED_USER',
      message: 'User belum terdaftar.',
    },
    unverifiedEmail: {
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Email belum terverifikasi.',
    },
    unverifiedPhone: {
      code: 'PHONE_NOT_VERIFIED',
      message: 'Nomer telepon belum terverifikasi.',
    },
    unverifiedUser: {
      code: 'USER_NOT_VERIFIED',
      message: 'User belum terverifikasi.',
    },
    unauthorizedRefreshToken: {
      code: 'REFRESH_TOKEN_UNAUTHORIZED',
      message: 'Refresh Token Tidak Sah.',
    },
    cannotDeleteOwnUser: {
      code: 'CAN_NOT_DELETE_OWN_USER',
      message: 'Tidak dapat menghapus user sendiri',
    },
  },

  login: {
    success: 'Login Success.',
    fail: 'Login Gagal.',
    invalid: 'Data yang anda masukan tidak valid',
    invalid_email: 'Email dan atau password tidak benar',
    invalid_phone: 'Nomor telepon dan atau password tidak benar',
    invalid_old_password: 'Password lama tidak benar',
    password_null: 'Data anda belum lengkap. Silakan lengkapi profile anda.',
  },
  refresh_token: {
    success: 'Refresh Token Success.',
  },
};
