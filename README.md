# ⚙️ Vault CLI  
> 💾 TypeScript + SQLite tabanlı interaktif komut geçmişi ve kategori yöneticisi  

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![SQLite](https://img.shields.io/badge/SQLite-embedded-blueviolet)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)

---

## 🧭 Genel Bakış

**Vault CLI**, terminalde çalıştırdığın komutları kaydeden, arayabilen, kategorize edebilen ve yeniden çalıştırabilen güçlü bir komut satırı aracıdır.  
Artık yalnızca geçmiş değil — komutlarını kategorilere ayırabilir, belirli kategorileri varsayılan olarak atayabilir ve geçmişini dışa aktarabilirsin.  

Vault CLI; **Node.js**, **TypeScript** ve **SQLite** temelli, tamamen yerel çalışan bir araçtır.  
Tüm veriler sadece senin cihazında saklanır.

---

## 🚀 Özellikler

| Kategori | Özellik | Açıklama |
|-----------|----------|-----------|
| 📜 **Geçmiş Yönetimi** | `show-history` | Komut geçmişini tablo olarak gösterir |
| | `search-term <term>` | Anahtar kelimeyle geçmişte arama yapar |
| | `rerun <id>` | Belirli komutu ID’sine göre yeniden çalıştırır |
| | `pick` | Ok tuşlarıyla interaktif şekilde komut seçme |
| | `run-last` | En son çalıştırılan komutu tekrar çalıştırır |
| | `clear-history` | Komut geçmişini temizler |
| | `export-as [format]` | Geçmişi CSV veya JSON formatında dışa aktarır |
| 🗂️ **Kategori Yönetimi** | `categories` | Mevcut kategorileri listeler |
| | `create-category <name>` | Yeni bir kategori oluşturur |
| | `set-default-category <id>` | Varsayılan kategori tanımlar |
| ⚙️ **Diğer Komutlar** | `help` | Yardım menüsünü gösterir |
| | `version` | Vault CLI sürümünü gösterir |

---

| 🌐 **Vault API (Service)** | `GET /api/health` | Servis durumu |
| | `GET /api/history` | Tüm geçmiş kayıtlarını döner (sayfalama + arama destekli) |
| | `POST /api/history/rerun/:id` | Komutu yeniden çalıştırır |
| | `DELETE /api/history/:id` | Komutu siler |
| | `GET /api/categories` | Kategorileri listeler |
| | `POST /api/categories` | Yeni kategori oluşturur |
| | `POST /api/categories/default/:id` | Varsayılan kategoriyi değiştirir |
| | `GET /api/export?format=json|csv` | Geçmişi dışa aktarır |
| | `POST /api/import` | Dışarıdan JSON/CSV içe aktarır |

## 📦 Kurulum

### Gereksinimler
- Node.js v18+  
- NPM veya PNPM  

### Lokal Kurulum
```bash
git clone https://github.com/ouzsrcm/vault-cli.git
cd vault-cli
npm install
npm run build
npm link
npm run runall
