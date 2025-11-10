# Environment Variables Setup

Untuk menjalankan aplikasi ini, Anda perlu membuat file `.env` di root directory dengan variabel berikut:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com
VITE_BLOCK_EXPLORER_URL=https://sepolia-blockscout.lisk.com
```

## Penjelasan Variabel:

- **VITE_CONTRACT_ADDRESS**: Alamat smart contract SimpleBank yang sudah di-deploy di Lisk Sepolia Testnet
- **VITE_RPC_URL**: URL RPC untuk Lisk Sepolia Testnet (default: https://rpc.sepolia-api.lisk.com)
- **VITE_BLOCK_EXPLORER_URL**: URL Block Explorer untuk Lisk Sepolia Testnet (default: https://sepolia-blockscout.lisk.com)

## Catatan:

- Semua variabel environment di Vite harus diawali dengan `VITE_` agar bisa diakses di frontend
- File `.env` sudah di-ignore oleh git untuk keamanan
- Pastikan contract address yang Anda masukkan sudah benar dan sudah di-deploy di Lisk Sepolia Testnet (Chain ID: 4202)

