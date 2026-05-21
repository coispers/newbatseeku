import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { errands as seedErrands, freelancers } from '../constants/mock-data';

export type OrderKind = 'service' | 'errand';
export type OrderStatus = 'Requests' | 'Ongoing' | 'Finished';

export type Order = {
  id: string;
  kind: OrderKind;
  title: string;
  details: string;
  category: string;
  budget: number;
  location: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  freelancerId?: string;
  freelancerName?: string;
  freelancerAvatar?: string;
  urgency?: string;
  paymentMethod?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceOrderInput = {
  title: string;
  details: string;
  category: string;
  budget: number;
  location?: string;
  urgency?: string;
  paymentMethod?: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  freelancerId?: string;
  freelancerName?: string;
  freelancerAvatar?: string;
};

export type CreateErrandOrderInput = {
  title: string;
  category: string;
  budget: number;
  location: string;
  details?: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
};

type OrdersContextValue = {
  orders: Order[];
  createServiceOrder: (input: CreateServiceOrderInput) => Promise<Order>;
  createErrandOrder: (input: CreateErrandOrderInput) => Promise<Order>;
  acceptOrder: (orderId: string, freelancerId: string) => Promise<Order | null>;
  completeOrder: (orderId: string) => Promise<Order | null>;
  getOrderById: (orderId: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

const STORAGE_KEY = 'batseeku:orders';

const now = () => new Date().toISOString();

const createId = () => `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const serviceTitleByCategory: Record<string, string> = {
  tutoring: 'Tutoring request',
  programming: 'Programming help request',
  math: 'Math help request',
  lab: 'Lab assistance request',
  thesis: 'Thesis formatting request',
  research: 'Research help request',
  review: 'Review session request',
};

const seedOrders: Order[] = [
  {
    id: 'order-seed-1',
    kind: 'service',
    title: 'Calculus problem set help',
    details: 'Walk through problem set 3 and explain the tricky limits questions.',
    category: 'Math',
    budget: 200,
    location: 'Main Campus',
    requesterId: 'student1@g.batstate-u.edu.ph',
    requesterName: 'Juan Dela Cruz',
    freelancerId: 'f6',
    freelancerName: 'Noel Garcia',
    freelancerAvatar: 'NG',
    urgency: 'Normal',
    paymentMethod: 'GCash',
    status: 'Ongoing',
    createdAt: '2026-05-20T08:00:00.000Z',
    updatedAt: now(),
  },
  {
    id: 'order-seed-2',
    kind: 'service',
    title: 'Thesis formatting review',
    details: 'Check APA layout, heading levels, and reference formatting.',
    category: 'Thesis',
    budget: 350,
    location: 'Library',
    requesterId: 'student2@g.batstate-u.edu.ph',
    requesterName: 'Lia Santos',
    urgency: 'Urgent',
    paymentMethod: 'Cash',
    status: 'Requests',
    createdAt: '2026-05-21T07:10:00.000Z',
    updatedAt: now(),
  },
  {
    id: 'order-seed-3',
    kind: 'service',
    title: 'Physics lab report edits',
    details: 'Need a final pass before submission.',
    category: 'Lab',
    budget: 180,
    location: 'Engineering Building',
    requesterId: 'student3@g.batstate-u.edu.ph',
    requesterName: 'Marco Reyes',
    freelancerId: 'f4',
    freelancerName: 'Paolo Lim',
    freelancerAvatar: 'PL',
    status: 'Finished',
    createdAt: '2026-05-19T09:30:00.000Z',
    updatedAt: now(),
  },
  ...seedErrands.map((item) => ({
    id: `errand-${item.id}`,
    kind: 'errand' as OrderKind,
    title: item.title,
    details: item.title,
    category: item.category,
    budget: item.budget,
    location: item.location,
    requesterId: item.ownerId,
    requesterName: item.ownerId === 'student1@g.batstate-u.edu.ph' ? 'Juan Dela Cruz' : 'Student',
    status: 'Requests' as OrderStatus,
    createdAt: now(),
    updatedAt: now(),
  })),
];

const hydrateSeedOrders = () => seedOrders.map((order) => ({ ...order }));

const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(hydrateSeedOrders);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setOrders(JSON.parse(stored) as Order[]);
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
        }
      } catch {
        setOrders(hydrateSeedOrders());
      } finally {
        setHydrated(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [hydrated, orders]);

  const upsertOrder = useCallback(async (nextOrder: Order) => {
    setOrders((current) => {
      const without = current.filter((item) => item.id !== nextOrder.id);
      return [nextOrder, ...without];
    });
    return nextOrder;
  }, []);

  const createServiceOrder = useCallback(async (input: CreateServiceOrderInput) => {
    const freelancer = input.freelancerId
      ? freelancers.find((item) => item.id === input.freelancerId)
      : undefined;
    const createdAt = now();
    const nextOrder: Order = {
      id: createId(),
      kind: 'service',
      title: input.title || serviceTitleByCategory[input.category.toLowerCase()] || 'Service request',
      details: input.details,
      category: input.category,
      budget: input.budget,
      location: input.location ?? 'BatStateU',
      requesterId: input.requesterId,
      requesterName: input.requesterName,
      requesterAvatar: input.requesterAvatar,
      freelancerId: input.freelancerId,
      freelancerName: input.freelancerName ?? freelancer?.name,
      freelancerAvatar: input.freelancerAvatar ?? freelancer?.avatar,
      urgency: input.urgency,
      paymentMethod: input.paymentMethod,
      status: input.freelancerId ? 'Ongoing' : 'Requests',
      createdAt,
      updatedAt: createdAt,
    };

    await upsertOrder(nextOrder);
    return nextOrder;
  }, [upsertOrder]);

  const createErrandOrder = useCallback(async (input: CreateErrandOrderInput) => {
    const createdAt = now();
    const nextOrder: Order = {
      id: createId(),
      kind: 'errand',
      title: input.title,
      details: input.details ?? input.title,
      category: input.category,
      budget: input.budget,
      location: input.location,
      requesterId: input.requesterId,
      requesterName: input.requesterName,
      requesterAvatar: input.requesterAvatar,
      status: 'Requests',
      createdAt,
      updatedAt: createdAt,
    };

    await upsertOrder(nextOrder);
    return nextOrder;
  }, [upsertOrder]);

  const acceptOrder = useCallback(async (orderId: string, freelancerId: string) => {
    let updatedOrder: Order | null = null;

    setOrders((current) =>
      current.map((item) => {
        if (item.id !== orderId) {
          return item;
        }

        const freelancer = freelancers.find((entry) => entry.id === freelancerId);
        updatedOrder = {
          ...item,
          freelancerId,
          freelancerName: freelancer?.name,
          freelancerAvatar: freelancer?.avatar,
          status: 'Ongoing',
          updatedAt: now(),
        };
        return updatedOrder;
      })
    );

    return updatedOrder;
  }, []);

  const completeOrder = useCallback(async (orderId: string) => {
    let updatedOrder: Order | null = null;

    setOrders((current) =>
      current.map((item) => {
        if (item.id !== orderId) {
          return item;
        }

        updatedOrder = {
          ...item,
          status: 'Finished',
          updatedAt: now(),
        };
        return updatedOrder;
      })
    );

    return updatedOrder;
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => orders.find((item) => item.id === orderId),
    [orders]
  );

  const value = useMemo(
    () => ({
      orders,
      createServiceOrder,
      createErrandOrder,
      acceptOrder,
      completeOrder,
      getOrderById,
    }),
    [acceptOrder, completeOrder, createErrandOrder, createServiceOrder, getOrderById, orders]
  );

  return React.createElement(OrdersContext.Provider, { value }, children);
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within OrdersProvider');
  }

  return ctx;
};

export { OrdersProvider };