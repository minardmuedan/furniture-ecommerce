export default function Homepage() {
  const searchParam = new URLSearchParams()
  searchParam.append('min', 's')
  searchParam.append('mins', '123')
  return <p>{searchParam.toString()}</p>
}
