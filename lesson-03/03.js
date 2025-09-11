// Разработайте функцию findLargest, которая принимает три числа и возвращает наибольшее из них.

function findLargest(first, second, third) {

    return first>second&&first>third?first:second>first&&second>third?second:third

}