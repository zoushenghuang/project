import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories/category.entity';
import { Tag } from './tags/tag.entity';
import { Article } from './articles/article.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const categoryRepo = app.get<Repository<Category>>(getRepositoryToken(Category));
  const tagRepo = app.get<Repository<Tag>>(getRepositoryToken(Tag));
  const articleRepo = app.get<Repository<Article>>(getRepositoryToken(Article));

  // 清空现有数据
  await articleRepo.clear();
  await tagRepo.clear();
  await categoryRepo.clear();

  console.log('🌱 开始初始化数据库...');

  // 创建分类 - 前端、后端、运维
  const categories = [
    { name: '前端', description: '前端开发技术、框架和最佳实践', color: 'blue' },
    { name: '后端', description: '后端开发、API 设计和服务器技术', color: 'green' },
    { name: '运维', description: 'DevOps、容器化、云原生和基础设施', color: 'orange' },
  ];

  const savedCategories = await categoryRepo.save(categories);
  console.log(`✅ 创建了 ${savedCategories.length} 个分类`);

  // 创建标签 - 技术相关
  const tags = [
    { name: 'React' },
    { name: 'Vue' },
    { name: 'Next.js' },
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'NestJS' },
    { name: 'Docker' },
    { name: 'Kubernetes' },
    { name: '微服务' },
    { name: '性能优化' },
    { name: '最佳实践' },
    { name: 'Web3' },
    { name: 'AI' },
    { name: '工具' },
  ];

  const savedTags = await tagRepo.save(tags);
  console.log(`✅ 创建了 ${savedTags.length} 个标签`);

  // 创建文章 - 最新的前端技术文章
  const articles = [
    {
      title: 'React 19 新特性深度解析：并发渲染与自动批处理',
      summary: 'React 19 带来了许多令人兴奋的新特性，包括并发渲染、自动批处理优化、新的 Hooks API 等。本文将深入解析这些新特性及其实际应用场景。',
      content: `# React 19 新特性深度解析：并发渲染与自动批处理

React 19 是 React 团队推出的最新版本，带来了许多革命性的改进和新特性。本文将深入探讨这些新特性，帮助你更好地理解和使用它们。

## React 19 核心新特性

### 1. 并发渲染（Concurrent Rendering）

React 19 进一步完善了并发渲染机制，使得应用能够更流畅地响应用户交互。

\`\`\`jsx
// React 19 并发特性示例
import { useTransition, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      {isPending && <div>Loading...</div>}
      <Results query={deferredQuery} />
    </div>
  );
}
\`\`\`

### 2. 自动批处理（Automatic Batching）

React 19 现在会自动批处理所有状态更新，包括在 Promise、setTimeout 和原生事件处理器中的更新。

\`\`\`jsx
// 自动批处理示例
function handleClick() {
  // React 19 会自动批处理这些更新
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只会触发一次重新渲染
}

// 在异步操作中也会自动批处理
async function handleSubmit() {
  setLoading(true);
  await fetchData();
  setLoading(false);
  setData(newData);
  // 这些更新会被自动批处理
}
\`\`\`

### 3. 新的 Hooks API

#### useActionState

\`\`\`jsx
import { useActionState } from 'react';

function Form() {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await submitForm(formData);
    if (result.error) {
      return { error: result.error };
    }
    return { success: true };
  }, null);

  return (
    <form action={formAction}>
      <input name="email" />
      {state?.error && <p>{state.error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

#### useOptimistic

\`\`\`jsx
import { useOptimistic } from 'react';

function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );

  async function addTodo(formData) {
    addOptimisticTodo({ text: formData.get('text') });
    await saveTodo(formData);
  }

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id}>
          {todo.text}
          {todo.pending && <span> (saving...)</span>}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 4. 服务器组件改进

React 19 对服务器组件进行了重大改进，使得数据获取更加简单和高效。

\`\`\`jsx
// 服务器组件示例
async function BlogPost({ id }) {
  const post = await fetch(\`/api/posts/\${id}\`).then(r => r.json());
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

## 性能优化建议

### 1. 使用 useMemo 和 useCallback 的时机

在 React 19 中，由于自动批处理和并发渲染的改进，某些情况下可能不再需要过度使用这些优化。

\`\`\`jsx
// 只在必要时使用 useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 对于简单的计算，可能不需要 useMemo
const simpleValue = a + b; // 直接计算即可
\`\`\`

### 2. 利用并发特性

\`\`\`jsx
import { useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      {isPending && <Spinner />}
      <TabButton onClick={() => selectTab('about')}>About</TabButton>
      <TabButton onClick={() => selectTab('posts')}>Posts</TabButton>
      <TabButton onClick={() => selectTab('contact')}>Contact</TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
\`\`\`

## 迁移指南

### 从 React 18 升级到 React 19

1. **更新依赖**
\`\`\`bash
npm install react@19 react-dom@19
\`\`\`

2. **检查破坏性变更**
   - 某些 API 可能已被移除或更改
   - 检查官方迁移指南

3. **逐步采用新特性**
   - 先在新组件中使用新特性
   - 逐步迁移现有代码

## 总结

React 19 带来了许多令人兴奋的新特性和改进，特别是并发渲染和自动批处理，将显著提升应用的性能和用户体验。建议开发者尽快熟悉这些新特性，并在新项目中采用它们。`,
      coverImage: 'https://s.coze.cn/image/Rnz1KIqsXVU/',
      isFeatured: true,
      viewCount: 5200,
      commentCount: 128,
      category: savedCategories[0], // 前端
      tags: [savedTags[0], savedTags[3], savedTags[10]], // React、TypeScript、性能优化
    },
    {
      title: 'Next.js 15 全栈开发实战：App Router 与 Server Actions',
      summary: 'Next.js 15 引入了许多强大的新特性，包括改进的 App Router、Server Actions、Turbopack 等。本文将带你深入了解这些特性，并构建一个完整的全栈应用。',
      content: `# Next.js 15 全栈开发实战：App Router 与 Server Actions

Next.js 15 是 Vercel 推出的最新版本，带来了许多令人兴奋的新特性和性能改进。本文将深入探讨这些特性，并通过实际案例展示如何构建现代化的全栈应用。

## Next.js 15 核心特性

### 1. 改进的 App Router

App Router 在 Next.js 15 中得到了进一步完善，提供了更好的开发体验。

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx
export default function HomePage() {
  return <h1>欢迎来到 Next.js 15</h1>;
}
\`\`\`

### 2. Server Actions

Server Actions 允许你在服务器端执行操作，无需创建 API 路由。

\`\`\`tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 保存到数据库
  await savePost({ title, content });

  // 重新验证路径
  revalidatePath('/posts');
}

// app/components/CreatePostForm.tsx
'use client';

import { createPost } from '@/app/actions';

export function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">发布</button>
    </form>
  );
}
\`\`\`

### 3. 流式渲染（Streaming）

Next.js 15 支持流式渲染，可以逐步发送 HTML，提升用户体验。

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
      <FastComponent />
    </div>
  );
}
\`\`\`

### 4. Turbopack（稳定版）

Turbopack 现在是 Next.js 15 的默认打包工具，提供更快的开发体验。

\`\`\`bash
# 使用 Turbopack
next dev --turbo
\`\`\`

## 构建全栈博客应用

### 项目结构

\`\`\`
app/
  ├── layout.tsx
  ├── page.tsx
  ├── posts/
  │   ├── page.tsx
  │   ├── [id]/
  │   │   └── page.tsx
  │   └── actions.ts
  └── api/
      └── posts/
          └── route.ts
\`\`\`

### 数据库模型

\`\`\`tsx
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
  });
}

export async function createPost(data: { title: string; content: string }) {
  return await prisma.post.create({ data });
}
\`\`\`

### Server Actions 实现

\`\`\`tsx
// app/posts/actions.ts
'use server';

import { createPost, deletePost } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await createPost({ title, content });
  revalidatePath('/posts');
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidatePath('/posts');
}
\`\`\`

### 客户端组件

\`\`\`tsx
// app/posts/components/PostForm.tsx
'use client';

import { createPostAction } from '../actions';
import { useTransition } from 'react';

export function PostForm() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createPostAction(formData);
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit" disabled={isPending}>
        {isPending ? '发布中...' : '发布'}
      </button>
    </form>
  );
}
\`\`\`

## 性能优化技巧

### 1. 使用缓存策略

\`\`\`tsx
// 静态生成
export const revalidate = 3600; // 1小时

// 动态渲染
export const dynamic = 'force-dynamic';
\`\`\`

### 2. 图片优化

\`\`\`tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/..."
    />
  );
}
\`\`\`

### 3. 代码分割

\`\`\`tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>加载中...</p>,
  ssr: false,
});
\`\`\`

## 部署最佳实践

### 1. 环境变量配置

\`\`\`bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
\`\`\`

### 2. Vercel 部署

\`\`\`bash
vercel deploy
\`\`\`

## 总结

Next.js 15 提供了强大的全栈开发能力，通过 Server Actions、App Router 和流式渲染等特性，我们可以构建出高性能、用户体验优秀的现代 Web 应用。`,
      coverImage: 'https://s.coze.cn/image/w3OFiTOk9_0/',
      isFeatured: true,
      viewCount: 4800,
      commentCount: 95,
      category: savedCategories[0], // 前端
      tags: [savedTags[2], savedTags[3], savedTags[11]], // Next.js、TypeScript、最佳实践
    },
    {
      title: 'TypeScript 5.5 新特性：装饰器、const 类型参数与性能提升',
      summary: 'TypeScript 5.5 引入了装饰器支持、const 类型参数、改进的类型推断等新特性。本文将详细介绍这些特性及其在实际项目中的应用。',
      content: `# TypeScript 5.5 新特性：装饰器、const 类型参数与性能提升

TypeScript 5.5 带来了许多令人兴奋的新特性，包括对装饰器的完整支持、const 类型参数、改进的类型推断等。这些特性将显著提升开发体验和代码质量。

## TypeScript 5.5 核心新特性

### 1. 装饰器支持（Decorators）

TypeScript 5.5 现在完全支持 ECMAScript 装饰器提案。

\`\`\`ts
// 类装饰器
function Logger(target: any) {
  console.log(\`Class \${target.name} was defined\`);
}

@Logger
class UserService {
  // ...
}

// 方法装饰器
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyKey} with args:\`, args);
    const result = originalMethod.apply(this, args);
    console.log(\`Result:\`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b;
  }
}

// 属性装饰器
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Config {
  @ReadOnly
  apiUrl: string = 'https://api.example.com';
}
\`\`\`

### 2. const 类型参数

新的 const 类型参数允许更精确的类型推断。

\`\`\`ts
// 使用 const 类型参数
function processArray<const T extends readonly string[]>(arr: T) {
  return arr.map(item => item.toUpperCase());
}

const result = processArray(['hello', 'world']);
// result 类型: readonly ["HELLO", "WORLD"]

// 之前的写法需要手动指定
function processArrayOld<T extends readonly string[]>(arr: T) {
  return arr.map(item => item.toUpperCase());
}

const resultOld = processArrayOld(['hello', 'world'] as const);
\`\`\`

### 3. 改进的类型推断

TypeScript 5.5 改进了类型推断，特别是在处理复杂类型时。

\`\`\`ts
// 更好的联合类型推断
function getValue(key: 'name' | 'age') {
  const values = {
    name: 'John',
    age: 30,
  };
  return values[key]; // 类型推断更准确
}

// 改进的泛型推断
function createArray<T>(items: T[]): T[] {
  return items;
}

const numbers = createArray([1, 2, 3]); // T 被推断为 number
const strings = createArray(['a', 'b', 'c']); // T 被推断为 string
\`\`\`

### 4. 性能提升

TypeScript 5.5 在编译性能方面有显著提升。

\`\`\`bash
# 编译速度提升约 20-30%
tsc --build
\`\`\`

## 实际应用场景

### 1. 使用装饰器实现依赖注入

\`\`\`ts
// 依赖注入装饰器
const dependencies = new Map();

function Injectable(key: string) {
  return function (target: any) {
    dependencies.set(key, target);
  };
}

function Inject(key: string) {
  return function (target: any, propertyKey: string) {
    const dependency = dependencies.get(key);
    if (dependency) {
      target[propertyKey] = new dependency();
    }
  };
}

@Injectable('userService')
class UserService {
  getUsers() {
    return ['John', 'Jane'];
  }
}

class UserController {
  @Inject('userService')
  userService!: UserService;

  getUsers() {
    return this.userService.getUsers();
  }
}
\`\`\`

### 2. 使用 const 类型参数优化 API 响应类型

\`\`\`ts
// API 响应类型定义
type ApiResponse<const T> = {
  data: T;
  status: number;
  message: string;
};

async function fetchUser<const T extends Record<string, any>>(
  endpoint: string
): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint);
  return response.json();
}

// 使用
const userResponse = await fetchUser<{ id: number; name: string }>('/api/user');
// userResponse.data 的类型是 { id: number; name: string }
\`\`\`

### 3. 类型安全的配置管理

\`\`\`ts
// 配置装饰器
function Config(key: string) {
  return function (target: any, propertyKey: string) {
    const value = process.env[key];
    if (value) {
      target[propertyKey] = value;
    }
  };
}

class AppConfig {
  @Config('DATABASE_URL')
  databaseUrl!: string;

  @Config('API_KEY')
  apiKey!: string;
}

const config = new AppConfig();
\`\`\`

## 迁移指南

### 从 TypeScript 5.4 升级

1. **安装新版本**
\`\`\`bash
npm install -D typescript@5.5
\`\`\`

2. **更新 tsconfig.json**
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true, // 现在稳定支持
    "decorators": true
  }
}
\`\`\`

3. **检查破坏性变更**
   - 某些类型推断可能更严格
   - 检查编译错误并修复

## 最佳实践

### 1. 合理使用装饰器

\`\`\`ts
// ✅ 好的做法：使用装饰器增强功能
@Validate
@Log
class User {
  @Required
  name: string;
}

// ❌ 避免过度使用装饰器
@A @B @C @D class User {} // 太多装饰器
\`\`\`

### 2. 利用 const 类型参数

\`\`\`ts
// ✅ 使用 const 类型参数获得更精确的类型
function createConfig<const T extends Record<string, any>>(config: T): T {
  return config;
}

const config = createConfig({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
});
\`\`\`

## 总结

TypeScript 5.5 带来了许多强大的新特性，特别是装饰器支持和 const 类型参数，将显著提升开发体验和代码质量。建议开发者尽快升级并熟悉这些新特性。`,
      coverImage: 'https://s.coze.cn/image/IY8etA88B3w/',
      isFeatured: false,
      viewCount: 3600,
      commentCount: 78,
      category: savedCategories[0], // 前端
      tags: [savedTags[3], savedTags[11]], // TypeScript、最佳实践
    },
    {
      title: 'Vue 3.5 Composition API 最佳实践与性能优化',
      summary: 'Vue 3.5 带来了 Composition API 的进一步完善和性能优化。本文将深入探讨 Composition API 的最佳实践，以及如何优化 Vue 应用的性能。',
      content: `# Vue 3.5 Composition API 最佳实践与性能优化

Vue 3.5 进一步完善了 Composition API，并带来了显著的性能提升。本文将深入探讨 Composition API 的最佳实践，以及如何构建高性能的 Vue 应用。

## Composition API 核心概念

### 1. setup() 函数

\`\`\`vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 响应式数据
const count = ref(0);
const name = ref('Vue 3.5');

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
function increment() {
  count.value++;
}

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div>
    <h1>{{ name }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
\`\`\`

### 2. 组合式函数（Composables）

\`\`\`ts
// composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
}

// 使用
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';

const { count, increment, decrement } = useCounter(10);
</script>
\`\`\`

### 3. 响应式 API

\`\`\`ts
import { ref, reactive, computed, watch, watchEffect } from 'vue';

// ref - 基本类型
const count = ref(0);

// reactive - 对象
const state = reactive({
  name: 'Vue',
  age: 3,
});

// computed - 计算属性
const fullInfo = computed(() => \`\${state.name} \${state.age}\`);

// watch - 监听单个源
watch(count, (newVal, oldVal) => {
  console.log(\`Count changed from \${oldVal} to \${newVal}\`);
});

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(\`Count is: \${count.value}\`);
});
\`\`\`

## 性能优化技巧

### 1. 使用 v-memo 优化列表渲染

\`\`\`vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
  </div>
</template>
\`\`\`

### 2. 使用 shallowRef 和 shallowReactive

\`\`\`ts
import { shallowRef, shallowReactive } from 'vue';

// 对于大型对象，使用 shallowRef
const largeObject = shallowRef({
  // 大量数据
});

// 对于不需要深度响应式的对象
const config = shallowReactive({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
});
\`\`\`

### 3. 使用 defineAsyncComponent 懒加载组件

\`\`\`vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HeavyComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'));
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
\`\`\`

### 4. 使用 keep-alive 缓存组件

\`\`\`vue
<template>
  <keep-alive :include="['UserProfile', 'Settings']">
    <component :is="currentComponent" />
  </keep-alive>
</template>
\`\`\`

## 实际应用案例

### 1. 数据获取组合式函数

\`\`\`ts
// composables/useFetch.ts
import { ref, onMounted } from 'vue';

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchData();
  });

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// 使用
<script setup lang="ts">
import { useFetch } from '@/composables/useFetch';

interface User {
  id: number;
  name: string;
  email: string;
}

const { data: users, loading, error } = useFetch<User[]>('/api/users');
</script>
\`\`\`

### 2. 表单验证组合式函数

\`\`\`ts
// composables/useForm.ts
import { ref, computed } from 'vue';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const formData = ref<T>({ ...initialValues });
  const errors = ref<Partial<Record<keyof T, string>>>({});

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0;
  });

  function validate() {
    errors.value = {};
    // 验证逻辑
    // ...
    return isValid.value;
  }

  function reset() {
    formData.value = { ...initialValues };
    errors.value = {};
  }

  return {
    formData,
    errors,
    isValid,
    validate,
    reset,
  };
}
\`\`\`

## 总结

Vue 3.5 的 Composition API 提供了强大的组合能力，通过合理使用组合式函数和性能优化技巧，我们可以构建出高性能、可维护的 Vue 应用。`,
      coverImage: 'https://s.coze.cn/image/7U2D8EWDSdE/',
      isFeatured: false,
      viewCount: 4200,
      commentCount: 86,
      category: savedCategories[0], // 前端
      tags: [savedTags[1], savedTags[10]], // Vue、性能优化
    },
    {
      title: 'Node.js 与 NestJS：构建高性能 RESTful API',
      summary: 'NestJS 是基于 Node.js 的企业级框架，提供了完整的 TypeScript 支持和模块化架构。本文将介绍如何使用 NestJS 构建高性能的 RESTful API。',
      content: `# Node.js 与 NestJS：构建高性能 RESTful API

NestJS 是一个强大的 Node.js 框架，提供了完整的 TypeScript 支持、依赖注入、模块化架构等企业级特性。本文将深入探讨如何使用 NestJS 构建高性能的 RESTful API。

## NestJS 核心概念

### 1. 模块化架构

\`\`\`ts
// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
})
export class AppModule {}
\`\`\`

### 2. 控制器（Controllers）

\`\`\`ts
// users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
\`\`\`

### 3. 服务（Services）

\`\`\`ts
// users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find(user => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}
\`\`\`

### 4. 数据访问层（Repository Pattern）

\`\`\`ts
// users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
\`\`\`

## 数据库集成

### TypeORM 配置

\`\`\`ts
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'mydb',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
\`\`\`

### 实体定义

\`\`\`ts
// users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
\`\`\`

## 验证和转换

### DTO 和验证

\`\`\`ts
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}

// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
\`\`\`

## 性能优化

### 1. 使用缓存

\`\`\`ts
import { CacheModule } from '@nestjs/cache-manager';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5分钟
    }),
  ],
})
export class AppModule {}

// 使用缓存拦截器
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  // ...
}
\`\`\`

### 2. 数据库查询优化

\`\`\`ts
// 使用索引
@Entity('users')
@Index(['email'])
export class User {
  // ...
}

// 使用分页
async findAll(page: number, limit: number): Promise<User[]> {
  return this.userRepository.find({
    skip: (page - 1) * limit,
    take: limit,
  });
}
\`\`\`

## 总结

NestJS 提供了强大的企业级特性，通过模块化架构、依赖注入和完整的 TypeScript 支持，我们可以构建出高性能、可维护的 RESTful API。`,
      coverImage: 'https://s.coze.cn/image/CbBboKTSMBU/',
      isFeatured: false,
      viewCount: 3800,
      commentCount: 72,
      category: savedCategories[1], // 后端
      tags: [savedTags[5], savedTags[6], savedTags[11]], // Node.js、NestJS、最佳实践
    },
    {
      title: 'Docker 容器化部署实战：从开发到生产',
      summary: 'Docker 已经成为现代应用部署的标准工具。本文将详细介绍如何使用 Docker 进行容器化部署，包括多阶段构建、Docker Compose 和生产环境最佳实践。',
      content: `# Docker 容器化部署实战：从开发到生产

Docker 容器化技术已经成为现代应用部署的标准。本文将深入探讨 Docker 的核心概念、最佳实践，以及如何将应用从开发环境部署到生产环境。

## Docker 基础

### 1. Dockerfile 编写

\`\`\`dockerfile
# 多阶段构建示例
# 阶段1：构建
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 阶段2：运行
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
\`\`\`

### 2. .dockerignore

\`\`\`
node_modules
npm-debug.log
.git
.gitignore
.env
dist
coverage
.nyc_output
\`\`\`

### 3. Docker Compose

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

## 最佳实践

### 1. 使用多阶段构建

\`\`\`dockerfile
# 前端应用多阶段构建
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 2. 优化镜像大小

\`\`\`dockerfile
# 使用 Alpine 基础镜像
FROM node:20-alpine

# 清理缓存
RUN npm ci --only=production && npm cache clean --force

# 使用非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
\`\`\`

### 3. 健康检查

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js
\`\`\`

## 生产环境部署

### Kubernetes 部署

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-registry/my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
\`\`\`

## 总结

Docker 容器化技术为应用部署提供了标准化、可移植的解决方案。通过合理使用 Dockerfile、Docker Compose 和 Kubernetes，我们可以实现高效的容器化部署。`,
      coverImage: 'https://s.coze.cn/image/Te1ZxbmUnME/',
      isFeatured: false,
      viewCount: 4500,
      commentCount: 103,
      category: savedCategories[2], // 运维
      tags: [savedTags[7], savedTags[8], savedTags[11]], // Docker、Kubernetes、最佳实践
    },
    {
      title: 'Kubernetes 云原生应用部署指南',
      summary: 'Kubernetes 是容器编排的事实标准。本文将详细介绍如何使用 Kubernetes 部署和管理云原生应用，包括 Deployment、Service、Ingress 等核心概念。',
      content: `# Kubernetes 云原生应用部署指南

Kubernetes 已经成为容器编排的事实标准。本文将深入探讨 Kubernetes 的核心概念，以及如何使用它部署和管理云原生应用。

## Kubernetes 核心概念

### 1. Pod

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 3000
\`\`\`

### 2. Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
\`\`\`

### 3. Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
\`\`\`

### 4. Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
\`\`\`

## 配置管理

### ConfigMap

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgresql://localhost:5432/mydb"
  api_key: "your-api-key"
\`\`\`

### Secret

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  password: <base64-encoded-password>
\`\`\`

## 总结

Kubernetes 提供了强大的容器编排能力，通过合理使用 Deployment、Service、Ingress 等资源，我们可以构建出高可用、可扩展的云原生应用。`,
      coverImage: 'https://s.coze.cn/image/efe3cTgnUS0/',
      isFeatured: false,
      viewCount: 3900,
      commentCount: 88,
      category: savedCategories[2], // 运维
      tags: [savedTags[8], savedTags[9], savedTags[11]], // Kubernetes、微服务、最佳实践
    },
  ];

  const savedArticles = await articleRepo.save(articles);
  console.log(`✅ 创建了 ${savedArticles.length} 篇文章`);

  console.log('\n🎉 数据库初始化完成！');
  console.log(`📊 统计信息：`);
  console.log(`   - 分类：${savedCategories.length} 个`);
  console.log(`   - 标签：${savedTags.length} 个`);
  console.log(`   - 文章：${savedArticles.length} 篇`);

  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ 初始化失败:', error);
  process.exit(1);
});
