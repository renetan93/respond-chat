export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  website: string;
  address: Address;
};

export type Address = {
  street: string;
  city: string;
  zipcode: string;
};
