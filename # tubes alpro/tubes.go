package main

import "fmt"

const NMAX int = 1000000

type data struct {
	pakaian, kategori, warna, tingkat_formalitas, terpakai string
}

type tabint [NMAX]data

func main() {
	var data tabint
	var ndata, pilih int
	var ada int

	fmt.Scan(&ndata)
	bacadata(&data, ndata)

	for pilih != 8 {
		if pilih != 8 {
			menu()
			fmt.Print("Pilih (1/2/3/4/5/6/7/8)? ")
			fmt.Scan(&pilih)
			switch pilih {
			case 1:
				sequentialsearch(data, ndata, &ada)
				if ada != -1 {
					print(data, ada)
				} else {
					fmt.Print("Data tidak ada")
				}
			case 2:
				selectionsort(&data, ndata)
			case 3:
				cetakdata(data, ndata)
			case 4:
				rekomendasi(data, ndata)
			case 5:
				deletedata(&data, &ndata)
			case 6:
				kombinasi(data, ndata)
			}
		}
	}
}

func bacadata(A *tabint, n int) {
	var i int
	for i = 0; i < n; i++ {
		fmt.Print("Jenis Pakaian = ")
		fmt.Scan(&A[i].pakaian)
		fmt.Print("Kategori = ")
		fmt.Scan(&A[i].kategori)
		fmt.Print("Warna = ")
		fmt.Scan(&A[i].warna)
		fmt.Print("Tingkat Formalitas = ")
		fmt.Scan(&A[i].tingkat_formalitas)
		fmt.Print("Terpakai = ")
		fmt.Scan(&A[i].terpakai)
	}
}

func cetakdata(A tabint, n int) {
	var i int
	for i = 0; i < n; i++ {
		print(A, i)
	}
}

func print(A tabint, i int) {
	fmt.Println("Jenis Pakaian = ", A[i].pakaian)
	fmt.Println("Kategori = ", A[i].kategori)
	fmt.Println("Warna = ", A[i].warna)
	fmt.Println("Tingkat Formalitas = ", A[i].tingkat_formalitas)
	fmt.Println("Terpakai = ", A[i].terpakai)
}

func binarysearch(A tabint, n int, cari string) int {
	var left, right, middle, found int
	found = -1
	left = 0
	right = n - 1
	for found != -1 && left <= right {
		middle = (left + right) / 2
		if A[middle].tingkat_formalitas == cari {
			return middle
		} else if A[middle].tingkat_formalitas < cari {
			left = middle + 1
		} else {
			right = middle - 1
		}
	}
	return -1
}

func sequentialsearch(A tabint, n int, ada *int) {
	var i, m, dicari int
	var cari string
	var found bool
	found = false
	dicari = -1
	fmt.Println("1. Jenis Pakaian ")
	fmt.Println("2. Kategori ")
	fmt.Println("3. Warna ")
	fmt.Println("4. Tingkat formalitas ")
	fmt.Println("5. Terpakai ")
	fmt.Println("Pilih yang ingin dicari = ")
	fmt.Scan(&m)
	fmt.Println("Masukkan yang ingin dicari = ")
	fmt.Scan(&cari)
	for !found && i < n {
		switch m {
		case 1:
			found = cari == A[i].pakaian
		case 2:
			found = cari == A[i].kategori
		case 3:
			found = cari == A[i].warna
		case 4:
			found = cari == A[i].tingkat_formalitas
		case 5:
			found = cari == A[i].terpakai
		}
		if found {
			dicari = i
		}
		i++
	}
	*ada = dicari
}

func selectionsort(A *tabint, n int) {
	var i, idx int
	var pass int
	var temp data

	pass = 1
	for pass < n {
		idx = pass - 1
		i = pass
		for i < n {
			if A[i].pakaian < A[idx].pakaian {
				idx = i
			}
			i++
		}
		temp = A[idx]
		A[idx] = A[pass-1]
		A[pass] = temp
		pass++
	}
}

func rekomendasi(A tabint, n int) {
	var acara string
	var i, ada int

	for i = 0; i < n; i++ {
		ada = binarysearch(A, n, acara)
		if ada != -1 {
			print(A, ada)
		}
	}

}

func kombinasi(A tabint, n int) {

}

func deletedata(A *tabint, n *int) {
	var idx, i int
	fmt.Print("Masukkan index data yang ingin dihapus = ")
	fmt.Scan(&idx)
	for i = idx; i < *n-1; i++ {
		A[i] = A[i+1]
	}
	*n = *n - 1
}

func menu() {
	fmt.Println("-----------------------")
	fmt.Println("	M E N U		")
	fmt.Println("-----------------------")
	fmt.Println("1. Search Data")
	fmt.Println("2. Sort Data")
	fmt.Println("3. Print Data")
	fmt.Println("4. Recommendation")
	fmt.Println("5. Delete Selected Data")
	fmt.Println("6. Combination")
	fmt.Println("7. ")
	fmt.Println("8. Exit")
	fmt.Println("-----------------------")
}
