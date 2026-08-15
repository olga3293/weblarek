# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
В ходе анализа предметной области были выделены две основные сущности, используемые в приложении: Товар и Покупатель. Ниже приведены их интерфейсы и назначение.

Товар (IProduct)
Используется для учёта товаров в системе.
interface IProduct {
  id: string; - уникальный идентификатор товара
  description: string; - описание товара
  image: string; - ссылка на изображение
  title: string; - наименование товара
  category: string; - категория товара
  price: number | null; - цена товара (может отсутствовать)
}

Покупатель (ICustomer)
Используется для сбора и хранения данных, необходимых при оформлении заказа.
interface ICustomer {
  payment: TPayment; - способ оплаты
  email: string | null; - адрес электронной почты
  phone: string | null; - номер телефона
  address: string | null; - адрес доставки
}

### Модели данных
Класс Catalog
Отвечает за хранение и управление каталогом товаров.
Констурктор:
- constructor(products: IProduct[] = [])
Инициализирует каталог с переданным массивом товаров. Если массив не передан, создаётся пустой.
Поля:
- products: IProduct[] — массив всех доступных товаров.
- selectedProduct: IProduct | null — выбранный для детального просмотра товар.
Методы:
- setProducts(products: IProduct[]): void — заменяет текущий массив товаров.
- getProducts(): IProduct[] — возвращает массив товаров.
- getProductById(id: string): IProduct | undefined — ищет товар по идентификатору; возвращает товар или undefined.
- setSelectedProduct(product: IProduct): void — сохраняет товар для детального просмотра.
- getSelectedProduct(): IProduct | null — возвращает выбранный товар или null.

Класс Cart
Управляет корзиной покупок.
Констурктор:
- constructor()
Создаёт пустую корзину.
Поля:
- products: IProduct[] — массив товаров, добавленных в корзину.
Методы:
- getCartProducts(): IProduct[] | null — возвращает товары в корзине или null.
- addToCart(product: IProduct): void — добавляет товар в корзину.
- removeFromCart(product: IProduct): void — удаляет товар из корзины.
- clearCart(): void — полностью очищает корзину.
- getTotalPrice(): number — возвращает общую стоимость всех товаров.
- getTotalCount(): number — возвращает общее количество товаров.
- hasProduct(id: string): boolean — проверяет наличие товара по идентификатору.

Класс Customer
Хранит данные покупателя для оформления заказа.
Конструктор:
- constructor()
Инициализирует все поля со значениями по умолчанию.
Поля:
- payment: TPayment — выбранный способ оплаты (по умолчанию пустая строка).
- address: string | null — адрес доставки.
- email: string | null — электронная почта.
- phone: string | null — номер телефона.

Методы:
- setPayment(payment: TPayment): void — устанавливает способ оплаты.
- setAddress(address: string | null): void — устанавливает адрес.
- setEmail(email: string | null): void — устанавливает email.
- setPhone(phone: string | null): void — устанавливает номер телефона.
- getData(): ICustomer — возвращает все данные покупателя.
- clear(): void — сбрасывает все поля.
- validate(): CustomerError — проверяет корректность заполнения полей (не пустые и валидные).

### Слой коммуникации
Класс AppApi
Отвечает за взаимодействие с сервером API "веб-ларёк". Использует композицию с базовым классом Api для выполнения HTTP-запросов.
Конструктор:
- constructor(baseUrl: string, options?: RequestInit)
- baseUrl — базовый URL сервера
- options — дополнительные опции для запросов
Методы:
- getProducts(): Promise<IProduct[]>
Выполняет GET-запрос на эндпоинт /product/
Возвращает массив товаров с сервера
- postOrder(orderData: IOrderRequest): Promise<IOrderResponse>
Выполняет POST-запрос на эндпоинт /order/
Принимает данные заказа (покупатель + корзина)
Возвращает ответ с подтверждением покупки

### Слой представления (View)

## Интерфейсы
- IHeader
Данные для шапки сайта.
counter: number — количество товаров в корзине.

- IBasket
Структура корзины.
basketList: HTMLElement[] — список элементов товаров в корзине.
basketPrice: string — итоговая стоимость корзины в виде строки.

- IGallery
Описывает структуру данных для галереи товаров.
catalog: HTMLElement[] — массив элементов карточек для отображения в галерее.

- ICard
Базовый интерфейс карточки товара.
title: string — название товара.
price: number | null — цена товара (может быть null).

- ICardWithImage extends ICard
Расширяет базовую карточку, добавляя поля для изображения и категории.
image: string — ссылка на изображение товара.
category: string — категория товара.

- ICardDetail extends ICardWithImage
Расширяет карточку с изображением, добавляя полное описание.
description: string — полное описание товара.

- ICardBasket extends ICard
Расширяет базовую карточку для отображения в корзине.
itemIndex: number — порядковый номер товара в корзине.

- IModalContainer
Структура модального окна.
content: HTMLElement — HTML-элемент с содержимым окна.

- IOrderSuccess
Окно успешного заказа.
successDescription: string — текст сообщения об успешной оплате.

- IForm
Базовый интерфейс для форм.
textError: string — текст ошибки валидации.

- IFormOrder extends IForm
Структура формы заказа.
payment: string | null — выбранный способ оплаты.
address: string | null — введённый адрес.

- IFormContacts extends IForm
Структура формы контактов.
email: string | null — введённый email.
phone: string | null — введённый телефон.

- IOrderActions
Интерфейс колбэков для формы заказа.
onChooseCard?: () => void — выбран способ оплаты онлайн.
onChooseCash?: () => void — выбран способ оплаты на месте.
onAddressInput?: (value: string) => void — ввод адреса.
onClickFurther?: () => void — нажатие на кнопку "Далее".
onEmailInput?: (value: string) => void — ввод email.
onPhoneInput?: (value: string) => void — ввод телефона.
onClickPay?: () => void — нажатие на кнопку "Оплатить".

- ICardActions
Интерфейс действий для карточек.
onClick?: (event: MouseEvent) => void — обработчик клика по карточке.

- ICloseAction
Интерфейс для закрытия модального окна.
onClose?: () => void — обработчик закрытия.

## Базовые абстрактные классы
- Абстрактный класс Component<T>
Базовый класс для всех компонентов представления.
Конструктор: constructor(protected container: HTMLElement)
Сохраняет корневой DOM-элемент компонента.
Методы: render(data?: Partial<T>): HTMLElement — обновляет компонент с переданными данными и возвращает корневой элемент.

- Абстрактный класс Card<T extends ICard> extends Component<T>
Базовый класс для всех карточек товара.
Конструктор: constructor(container: HTMLElement)
Находит элементы разметки:
  .card__title — заголовок карточки.
  .card__price — цена товара.
Поля:
  titleElement: HTMLElement — элемент заголовка.
  priceElement: HTMLElement — элемент цены.
Методы:
  set title(value: string) — устанавливает название товара.
  set price(value: number | null) — устанавливает цену. Если цена равна null, отображается текст "Бесценно".

- Абстрактный класс CardWithImage extends Card<ICardWithImage>
Расширяет базовую карточку, добавляя изображение и категорию.
Конструктор: constructor(container: HTMLElement)
Находит дополнительные элементы разметки:
  .card__image — изображение товара.
  .card__category — категория товара.
Поля:
  imageElement: HTMLImageElement — элемент изображения.
  categoryElement: HTMLElement — элемент категории.
Методы:
  set category(value: string) — устанавливает категорию.
  set image(value: string) — устанавливает путь к изображению.

- Абстрактный класс Form<T> extends Component<T>
Базовый класс для всех форм.
Конструктор: constructor(container: HTMLElement)
Находит элементы разметки:
  button[type="submit"] — кнопка отправки формы.
  .form__errors — элемент для вывода ошибок.
Поля: 
  submitButton: HTMLButtonElement — кнопка отправки.
  errorsElement: HTMLElement — элемент для ошибок.
Методы:
  set textError(value: string) — отображает текст ошибки.
  protected onInputChange(field: keyof T, value: string) — обработчик изменения поля.

## Классы карточек
- Класс CardCatalog extends CardWithImage
Карточка товара в каталоге.
Конструктор: constructor(container: HTMLElement, actions?: ICardActions)
Вызывает конструктор родителя. Вешает слушатель клика на карточку. При клике генерируется событие card-catalog:click с данными товара.
Наследует все поля и методы от CardWithImage.

- Класс CardDetail extends CardWithImage
Детальная карточка товара.
Конструктор: constructor(container: HTMLElement, actions?: ICardActions)
Вызывает конструктор родителя. Находит элементы разметки:
  .card__text — описание товара.
  .card__button — кнопка добавления/удаления.
Вешает слушатель на кнопку. При клике генерируется событие card-detail:click.
Поля: 
  descriptionElement: HTMLElement — элемент описания.
  addButton: HTMLButtonElement — кнопка действия.
Методы:
  set description(value: string) — устанавливает описание.
  set buttonText(value: string) — устанавливает текст кнопки ("В корзину" или "Убрать").

- Класс CardBasket extends Card<ICardBasket>
Карточка товара в корзине.
Конструктор: constructor(container: HTMLElement, actions?: ICardActions)
Вызывает конструктор родителя. Находит элементы разметки:
  .basket__item-index — порядковый номер.
  .card__button — кнопка удаления.
Вешает слушатель на кнопку удаления. При клике генерируется событие card-basket:click.
Поля: 
  itemIndexElement: HTMLElement — элемент с номером товара.
  deleteButton: HTMLButtonElement — кнопка удаления.
Методы: 
  set itemIndex(value: number) — устанавливает порядковый номер.

## Классы компонентов
- Класс Header extends Component<IHeader>
Шапка сайта с корзиной.
Конструктор: constructor(container: HTMLElement, events: IEvents)
Находит элементы разметки:
  .header__basket — кнопка корзины.
  .header__basket-counter — счётчик товаров.
Вешает слушатель на кнопку корзины. При клике генерируется событие header-basket:click.
Поля: 
  basketButton: HTMLButtonElement — кнопка корзины.
  counterElement: HTMLElement — элемент счётчика.
Методы: 
  set counter(value: number) — обновляет счётчик товаров.

- Класс Basket extends Component<IBasket>
Корзина со списком товаров.
Конструктор: constructor(container: HTMLElement, events: IEvents)
Находит элементы разметки:
  .basket__list — список товаров.
  .basket__button — кнопка оформления заказа.
  .basket__price — общая стоимость.
Вешает слушатель на кнопку оформления. При клике генерируется событие basket-button:click.
Поля: 
  basketListElement: HTMLElement — контейнер списка.
  basketButton: HTMLButtonElement — кнопка оформления.
  basketPriceElement: HTMLElement — элемент с общей стоимостью.
Методы: 
  set basketList(items: HTMLElement[]) — отображает список товаров.
  set basketPrice(value: string) — отображает общую стоимость.

- Класс Gallery extends Component<IGallery>
Отвечает за отображение галереи товаров.
Конструктор: constructor(container: HTMLElement)
Находит элемент .gallery для размещения карточек.
Методы:
  set catalog(items: HTMLElement[]) — отображает массив карточек в галерее.

- Класс ModalContainer extends Component<IModalContainer>
Модальное окно.
Конструктор: constructor(container: HTMLElement, actions?: ICloseAction)
Находит элементы разметки:
  .modal__close — кнопка закрытия.
  .modal__content — контейнер для контента.
Вешает слушатель на кнопку закрытия. При клике генерируется событие modal:close. Закрытие также происходит при клике на оверлей.
Поля: 
  closeButton: HTMLButtonElement — кнопка закрытия.
  contentElement: HTMLElement — контейнер контента.
Методы: 
  set content(value: HTMLElement) — устанавливает содержимое.
  open() — открывает модальное окно (добавляет класс modal_active).
  close() — закрывает модальное окно (удаляет класс modal_active).

- Класс OrderSuccess extends Component<IOrderSuccess>
Окно успешного оформления заказа.
Конструктор: constructor(container: HTMLElement, events: IEvents)
Находит элементы разметки:
  .order-success__description — описание успешного заказа.
  .order-success__close — кнопка закрытия.
Вешает слушатель на кнопку закрытия. При клике генерируется событие modal:close.
Поля: 
  descriptionElement: HTMLElement — элемент с описанием.
  closeButton: HTMLButtonElement — кнопка закрытия.
Методы:
  set successDescription(value: string) — отображает сообщение об успешном заказе (например, "Списано {total} синапсов").

## Классы форм
- Класс FormOrder extends Form<IFormOrder>
Форма заказа с выбором оплаты и вводом адреса.
Конструктор: constructor(container: HTMLElement, actions: IOrderActions)
Вызывает конструктор родителя. 
Находит элементы разметки:
  input[name="address"] — поле ввода адреса.
  button[name="card"] — кнопка выбора оплаты картой.
  button[name="cash"] — кнопка выбора оплаты наличными.
Вешает слушатели:
  На кнопки оплаты — генерируются события payment:card или payment:cash.
  На поле ввода адреса — генерируется событие customer-address:input при вводе.
  На кнопку "Далее" — генерируется событие form-order-button:click.
Поля:
  addressInput: HTMLInputElement — поле ввода адреса.
  cardButton: HTMLButtonElement — кнопка оплаты картой.
  cashButton: HTMLButtonElement — кнопка оплаты наличными.
Методы:
  set payment(value: string | null) — активирует соответствующую кнопку оплаты.
  set address(value: string | null) — устанавливает значение в поле адреса.

- Класс FormContacts extends Form<IFormContacts>
Форма контактов с вводом email и телефона.
Конструктор: constructor(container: HTMLElement, actions: IOrderActions)
Вызывает конструктор родителя. Находит элементы разметки:
  input[name="email"] — поле ввода email.
  input[name="phone"] — поле ввода телефона.
Вешает слушатели:
  На поле email — генерируется событие contact:email при вводе.
  На поле phone — генерируется событие contact:phone при вводе.
  На кнопку "Оплатить" — генерируется событие order:pay.
Поля:
  emailInput: HTMLInputElement — поле ввода email.
  phoneInput: HTMLInputElement — поле ввода телефона.
Методы:
  set email(value: string | null) — устанавливает значение в поле email.
  set phone(value: string | null) — устанавливает значение в поле телефона.

## События

# Header header-basket:click
Клик по кнопке корзины
Открывает корзину в модалке

# Basket basket-button:click
Клик по кнопке "Оформить"
Открывает форму заказа

# Cart (Model) cart:changed
addToCart() / removeFromCart()
Обновляет корзину, счётчик, детальную карточку

# Catalog (Model) catalog:changed
setProducts()	
Создаёт карточки, обновляет галерею

# Catalog (Model) card:selected
setSelectedProduct()
Открывает детальную карточку в модалке

# CardCatalog card-catalog:click
Клик по карточке
Сохраняет выбранный товар

# CardDetail card-detail:click
Клик по кнопке в детальной карточке	
Добавляет/удаляет товар из корзины

# CardBasket card-basket:click
Клик по кнопке удаления
Удаляет товар из корзины

# Customer (Model) customer:changed
Изменение данных
Обновляет формы заказа

# FormOrder payment:card
Клик по кнопке "Онлайн"
Сохраняет способ оплаты 'card'

# FormOrder payment:cash
Клик по кнопке "При получении"
Сохраняет способ оплаты 'cash'

# FormOrder customer-address:input 
Ввод адреса
Сохраняет адрес в Customer

# FormOrder form-order-button:click
Клик по кнопке "Далее"
Открывает форму контактов

# FormContacts contact:email
Ввод email
Сохраняет email в Customer

# FormContacts contact:phone
Ввод телефона
Сохраняет телефон в Customer

# FormContacts order:pay
Клик по кнопке "Оплатить"
Отправляет заказ на сервер

# ModalContainer modal:close
Клик по кнопке закрытия
Закрывает модальное окно

### Presenter
Презентер является связующим звеном между моделями данных и слоем представления. Он обрабатывает события, генерируемые моделями и компонентами, и управляет отображением данных на странице.
Основные принципы:
  Презентер обрабатывает события, а не генерирует их
  Представление перерисовывается только в двух случаях:
    При обработке события от модели данных (данные изменились)
    В результате обработки события открытия модального окна
  Все данные хранятся только в моделях
  Презентер не содержит бизнес-логики, только логику управления представлением