function reverseLinkList(head){
	let prev = null
	let curr = head
	while (curr) {
		const next = curr.next
		curr.next = prev
		curr = next
		prev = curr
	}
	return curr
}
