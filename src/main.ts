//Styles
import "./scss/styles.scss";
// Base
import { Api } from "./components/base/Api.ts";
import { EventEmitter } from "./components/base/Events.ts";
// Models
import { Cart } from "./components/models/cart.ts";
import { Catalog } from "./components/models/catalog.ts";
import { Customer } from "./components/models/customer.ts";
// AppApi
import { AppApi } from "./components/AppApi.ts";
// Types
import { IProduct, IOrderRequest } from "./types/index.ts";
// Constants
import { API_URL, CDN_URL, categoryMap } from "./utils/constants.ts";
// Test data
import { apiProducts } from "./utils/data.ts";

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

console.log('🚀 Запуск приложения "Веб-ларёк"');
console.log(`🌐 API URL: ${API_URL}`);
console.log(`🖼️  CDN URL: ${CDN_URL}`);
console.log('');

// Создаем экземпляры
const events = new EventEmitter();
const catalog = new Catalog(events);
const cart = new Cart(events);
const customer = new Customer(events);

// Создаем экземпляр Api и передаем его в AppApi
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);

console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ ===\n');

// ============================================
// 1. ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА
// ============================================
console.log('📦 Загрузка товаров с сервера...');

api.getProducts()
    .then((response) => {
        console.log('✅ Товары успешно загружены с сервера');
        console.log(`📊 Всего товаров на сервере: ${response.total}`);
        console.log(`📊 Получено товаров: ${response.items.length}`);

        catalog.setProducts(response.items);
        showCatalogAndTest(response.items);
    })
    .catch((error: Error) => {
        console.warn('⚠️ Не удалось загрузить товары с сервера:');
        console.warn(`  📌 ${error.message}`);
        console.log('\n💡 Используем тестовые данные из data.ts');

        if (apiProducts && apiProducts.items) {
            catalog.setProducts(apiProducts.items);
            console.log(`📊 Количество товаров в тестовых данных: ${apiProducts.items.length}`);
            showCatalogAndTest(apiProducts.items);
        } else {
            console.error('❌ Нет доступных тестовых данных');
        }
    });

// ============================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ТЕСТИРОВАНИЯ
// ============================================
function showCatalogAndTest(products: IProduct[]) {
    console.log('\n' + '='.repeat(50));
    console.log('📋 КАТАЛОГ ТОВАРОВ');
    console.log('='.repeat(50));

    const catalogProducts = catalog.getProducts();

    catalogProducts.forEach((product, index) => {
        const priceDisplay = product.price !== null ? `${product.price} ₽` : 'Цена не указана';
        const categoryClass = categoryMap[product.category as keyof typeof categoryMap] || '';
        console.log(`  ${index + 1}. ${product.title}`);
        console.log(`     Категория: ${product.category} (${categoryClass})`);
        console.log(`     Цена: ${priceDisplay}`);
        console.log(`     Изображение: ${CDN_URL}${product.image}`);
        console.log('');
    });

    console.log(`📊 Всего товаров в каталоге: ${catalogProducts.length}`);

    // ============================================
    // 2. ТЕСТИРОВАНИЕ КОРЗИНЫ
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('🛒 ТЕСТИРОВАНИЕ КОРЗИНЫ');
    console.log('='.repeat(50));

    if (products.length > 0) {
        console.log('\n📥 Добавление товаров в корзину:');

        const testProduct1 = products[0];
        cart.addToCart(testProduct1);
        console.log(`  ✅ "${testProduct1.title}" - ${testProduct1.price ?? 'цена не указана'}`);

        if (products.length > 1) {
            const testProduct2 = products[1];
            cart.addToCart(testProduct2);
            console.log(`  ✅ "${testProduct2.title}" - ${testProduct2.price ?? 'цена не указана'}`);
        }

        if (products.length > 2) {
            const testProduct3 = products[2];
            cart.addToCart(testProduct3);
            console.log(`  ✅ "${testProduct3.title}" - ${testProduct3.price ?? 'цена не указана'}`);
        }

        console.log(`\n📊 В корзине ${cart.getTotalCount()} товаров`);
        console.log(`💰 Общая сумма: ${cart.getTotalPrice()} ₽`);

        const cartItems = cart.getCartProducts();
        if (cartItems) {
            console.log('\n📋 Содержимое корзины:');
            cartItems.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.title} (${item.price ?? 'цена не указана'})`);
            });
        }

        // ============================================
        // 3. ТЕСТИРОВАНИЕ ОТПРАВКИ ЗАКАЗА
        // ============================================
        console.log('\n' + '='.repeat(50));
        console.log('📦 ТЕСТИРОВАНИЕ ОФОРМЛЕНИЯ ЗАКАЗА');
        console.log('='.repeat(50));

        console.log('\n👤 Заполнение данных покупателя:');
        customer.setPayment('card');
        customer.setEmail('test@example.com');
        customer.setPhone('+79991234567');
        customer.setAddress('г. Москва, ул. Тверская, д. 1');

        const customerData = customer.getData();
        console.log('  Способ оплаты:', customerData.payment);
        console.log('  Email:', customerData.email);
        console.log('  Телефон:', customerData.phone);
        console.log('  Адрес:', customerData.address);

        console.log('\n🔍 Проверка валидации:');
        const errors = customer.validate();
        const isValid = Object.keys(errors).length === 0;
        console.log(`  Статус: ${isValid ? '✅ Валидно' : '❌ Есть ошибки'}`);

        if (!isValid) {
            console.log('  Ошибки:', errors);
            return;
        }

        // ============================================
        // 4. ФОРМИРОВАНИЕ ЗАКАЗА С УЧЕТОМ ТОВАРОВ БЕЗ ЦЕНЫ
        // ============================================

        // Получаем доступные и недоступные товары из корзины
        const availableProducts = cart.getAvailableProducts();
        const unavailableProducts = cart.getUnavailableProducts();

        // Проверяем, есть ли товары без цены
        if (unavailableProducts.length > 0) {
            console.log('\n⚠️ ВНИМАНИЕ: Товары без цены будут исключены из заказа:');
            unavailableProducts.forEach(p => {
                console.log(`  - "${p.title}" (ID: ${p.id})`);
            });
            console.log(`  Они не будут включены в заказ и не будут оплачены.\n`);
        }

        // Проверяем, есть ли доступные товары для заказа
        if (availableProducts.length === 0) {
            console.error('❌ Нет товаров для заказа');
            console.log('  💡 Все товары в корзине имеют цену null и не могут быть куплены');
            return;
        }

        console.log(`✅ Товаров для заказа: ${availableProducts.length}`);

        // Формируем данные для заказа ТОЛЬКО с доступными товарами
        const orderData: IOrderRequest = {
            payment: customerData.payment as 'cash' | 'card' | '',
            email: customerData.email!,
            phone: customerData.phone!,
            address: customerData.address!,
            total: availableProducts.reduce((sum, p) => sum + (p.price || 0), 0),
            items: availableProducts.map(p => p.id)
        };

        console.log('\n📤 Отправка заказа на сервер:');
        console.log('  Товары в заказе:');
        availableProducts.forEach((p, i) => {
            console.log(`    ${i + 1}. ${p.title} - ${p.price} ₽`);
        });
        console.log(`  Общая сумма: ${orderData.total} ₽`);
        console.log(`  ID товаров: ${orderData.items.join(', ')}`);
        console.log('\n  Полные данные заказа:');
        console.log(JSON.stringify(orderData, null, 2));

        // Отправляем заказ
        api.postOrder(orderData)
            .then((response) => {
                console.log('\n✅ Заказ успешно оформлен!');
                console.log(`  ID заказа: ${response.id}`);
                console.log(`  Сумма заказа: ${response.total} ₽`);

                // Очищаем корзину и данные покупателя
                cart.clearCart();
                customer.clear();
                console.log('\n🔄 Корзина и данные покупателя очищены');
            })
            .catch((error) => {
                console.error('\n❌ Ошибка при оформлении заказа:');
                console.error('  Сообщение:', error);
                console.log('\n💡 Проверьте:');
                console.log('  1. Все ли товары имеют цену');
                console.log('  2. Правильно ли указан URL сервера');
                console.log('  3. Соответствуют ли данные IOrderRequest');
                console.log('  4. Правильный ли формат телефона (без пробелов)');
            });
    } else {
        console.warn('⚠️ Нет товаров для тестирования');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
    console.log('='.repeat(50));
}