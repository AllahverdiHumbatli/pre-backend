/*
Напишите функцию `findCommonElements`, которая принимает два массива и возвращает массив, содержащий общие элементы из обоих массивов.

Входные данные:

- `array1`: Первый массив, содержащий любые типы данных.
- `array2`: Второй массив, содержащий любые типы данных.

Выходные данные:

- Массив, содержащий элементы, которые присутствуют в обоих исходных массивах.
- Если общих элементов нет, должен вернуться пустой массив

Пример использования:
findCommonElements([1, 2, 3], [2, 3, 4]) // [2, 3]

Подсказка: можно использовать функцию `includesElement`, которую мы написали ранее. Переписывать её не нужно, она доступна по всему проекту за счёт hoisting.
*/

function findCommonElements(arr1, arr2) {
    let uniqueArr1 = findUniqueElements(arr1);
    let uniqueArr2 = findUniqueElements(arr2);
    let result = [];

        for (let i = 0; i < uniqueArr1.length; i++) {
            if(includesElement(uniqueArr2, uniqueArr1[i])) {
                result.push(uniqueArr1[i]);
            }

    }
    return result

}
