package main

import "fmt"

// Iterative approach. 
// Time complexity: O(n) as it iteratives through 1 to n
func sum_to_n_a(n int) int {
	sum := 0
	for i := 1; i <= n; i++ {
		sum += i
	}
	return sum
}

// Recursive approach. 
// Time complexity: O(n) as n recursive calls made
func sum_to_n_b(n int) int {
	if n == 0 {
		return 0
	}
	return n + sum_to_n_b(n-1)
}

// Mathematical formula approach. 
// Time complexity: O(1) as it uses constant time arithmetic formula
func sum_to_n_c(n int) int {
	return n * (n + 1) / 2
}

func main() {
	fmt.Println("Question 4")
	fmt.Printf("First Sum Method: %d\n", sum_to_n_a(5))
	fmt.Printf("Second Sum Method: %d\n", sum_to_n_b(5))
	fmt.Printf("Third Sum Method: %d\n", sum_to_n_c(5))
}