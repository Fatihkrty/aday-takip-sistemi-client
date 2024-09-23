# Aday Takip Sistemi Client

Bu proje hakkında detaylı bilgilere [Aday Takip Sistemi](https://github.com/Fatihkrty/aday-takip-sistemi) repo adresi üzerinden erişebilirsiniz.

## Kullanılan Teknolojiler

- Typescript
- NextJs
- Material UI
- Material React Table
- Tanstack Table
- Tanstack React Query
- XLSX
- React To Print
- Zod

Proje `typescript` ile `NextJs` ve `Material UI` kullanılarak geliştirilmiştir. Form doğrulamaları için `zod` kullanılmıştır. Development aşamasında temiz kod görünümü ve standartizasyon sağlamak için `eslint` , `perfectionist` , `prettier` kullanılmıştır. Ayrıca gelişmiş tablo filtrelemelerinde data table olarak `tanstack/react-table` tabanlı `material-react-table` ve api istekleri kontrolü için `@tanstack/react-query` kullanılmıştır. Tablo üzerinde excel dosyası çıktısı almak için `xlsx` kütüphanesi kullanılmıştır. Komponent tabanlı yazdırma için `react-to-print` kullanılmıştır.

## Bilgisayarınızda Çalıştırın

Projeyi klonlayın

```bash
  git clone [proje-github-linki]
```

Proje dizinine gidin

```bash
  cd ats-client
```

Gerekli paketleri yükleyin

```bash
  yarn install
```

Proje üzerinde `env.dev` dosyasının içindeki backend adresiniz ile değiştirin.

Development modunda çalıştırmak için:

```bash
yarn dev
```

Product modunda çalıştırmak için `.env.dev` dosyasını `.env` olarak değiştirin. Ardından:

```bash
  yarn build && yarn start
```
