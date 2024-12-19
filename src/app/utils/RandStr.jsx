
export default function RandStr(digits) {
  const randStr = () => {
	return Math.random().toString(36).substr(2, digits);
  };
  return randStr();
}