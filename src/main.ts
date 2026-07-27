// Styles
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

// Подписка на событие изменения покупателя
events.on('customer:changed', (data) => {
    console.log('📢 Данные покупателя обновлены:', data);
});

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

        // Добавляем первый товар (с ценой)
        const testProduct1 = products[0];
        if (testProduct1.price !== null) {
            cart.addToCart(testProduct1);
            console.log(`  ✅ "${testProduct1.title}" - ${testProduct1.price} ₽`);
        } else {
            console.log(`  ⚠️ "${testProduct1.title}" - не добавлен (цена не указана)`);
        }

        // Добавляем второй товар (с ценой)
        if (products.length > 1) {
            const testProduct2 = products[1];
            if (testProduct2.price !== null) {
                cart.addToCart(testProduct2);
                console.log(`  ✅ "${testProduct2.title}" - ${testProduct2.price} ₽`);
            } else {
                console.log(`  ⚠️ "${testProduct2.title}" - не добавлен (цена не указана)`);
            }
        }

        // Добавляем третий товар (может быть без цены - Мамка-таймер)
        if (products.length > 2) {
            const testProduct3 = products[2];
            if (testProduct3.price !== null) {
                cart.addToCart(testProduct3);
                console.log(`  ✅ "${testProduct3.title}" - ${testProduct3.price} ₽`);
            } else {
                console.log(`  ⚠️ "${testProduct3.title}" - не добавлен (цена не указана)`);
            }
        }

        console.log(`\n📊 В корзине ${cart.getTotalCount()} товаров`);
        console.log(`💰 Общая сумма: ${cart.getTotalPrice()} ₽`);

        const cartItems = cart.getCartProducts();
        console.log('\n📋 Содержимое корзины:');
        if (cartItems.length > 0) {
            cartItems.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.title} (${item.price} ₽)`);
            });
        } else {
            console.log('  Корзина пуста');
        }

        // ============================================
        // 3. ТЕСТИРОВАНИЕ ВАЛИДАЦИИ ПОКУПАТЕЛЯ
        // ============================================
        console.log('\n' + '='.repeat(50));
        console.log('🔍 ТЕСТИРОВАНИЕ ВАЛИДАЦИИ ПОКУПАТЕЛЯ');
        console.log('='.repeat(50));

        // 3.1 Тест с пустыми полями
        console.log('\n📝 Тест 1: Валидация с пустыми полями');
        console.log('  Ожидаемый результат: ошибки для всех полей');
        
        customer.clear();
        const emptyErrors = customer.validate();
        console.log('  Результат валидации пустых полей:');
        if (Object.keys(emptyErrors).length > 0) {
            console.log('  ❌ Найдены ошибки:');
            Object.entries(emptyErrors).forEach(([field, message]) => {
                console.log(`    - ${field}: ${message}`);
            });
        } else {
            console.log('  ✅ Данные валидны (неожиданно)');
        }

        // 3.2 Тест с частично заполненными полями
        console.log('\n📝 Тест 2: Валидация с частично заполненными полями');
        console.log('  Ожидаемый результат: ошибка для телефона');
        
        customer.setPayment('card');
        customer.setEmail('test@example.com');
        customer.setAddress('г. Москва, ул. Тверская, д. 1');
        // Телефон оставляем пустым
        
        const partialErrors = customer.validate();
        console.log('  Результат валидации (без телефона):');
        if (Object.keys(partialErrors).length > 0) {
            console.log('  ❌ Найдены ошибки:');
            Object.entries(partialErrors).forEach(([field, message]) => {
                console.log(`    - ${field}: ${message}`);
            });
        } else {
            console.log('  ✅ Данные валидны (неожиданно)');
        }

        // 3.3 Тест с полностью заполненными полями
        console.log('\n📝 Тест 3: Валидация с полностью заполненными полями');
        console.log('  Ожидаемый результат: все поля валидны');
        
        customer.setPhone('+79991234567');
        const fullErrors = customer.validate();
        console.log('  Результат валидации (все поля заполнены):');
        if (Object.keys(fullErrors).length === 0) {
            console.log('  ✅ Все поля валидны');
        } else {
            console.log('  ❌ Найдены ошибки:');
            Object.entries(fullErrors).forEach(([field, message]) => {
                console.log(`    - ${field}: ${message}`);
            });
        }

        // ============================================
        // 4. ТЕСТИРОВАНИЕ ОТПРАВКИ ЗАКАЗА
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

        // Финальная проверка валидации перед отправкой заказа
        console.log('\n🔍 Финальная проверка валидации:');
        const finalErrors = customer.validate();
        if (Object.keys(finalErrors).length === 0) {
            console.log('  ✅ Данные валидны');
        } else {
            console.log('  ❌ Ошибки валидации:', finalErrors);
            return;
        }

        // ============================================
        // 5. ФОРМИРОВАНИЕ ЗАКАЗА
        // ============================================

        // Получаем все товары из корзины
        const cartProducts = cart.getCartProducts();

        // Проверяем, есть ли товары для заказа
        if (cartProducts.length === 0) {
            console.error('❌ Нет товаров для заказа');
            console.log('  💡 Корзина пуста');
            return;
        }

        console.log(`\n✅ Товаров для заказа: ${cartProducts.length}`);

        // Формируем данные для заказа
        const orderData: IOrderRequest = {
            payment: customerData.payment as 'cash' | 'card' | '',
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            total: cart.getTotalPrice(),
            items: cartProducts.map(p => p.id)
        };

        console.log('\n📤 Отправка заказа на сервер:');
        console.log('  Товары в заказе:');
        cartProducts.forEach((p, i) => {
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