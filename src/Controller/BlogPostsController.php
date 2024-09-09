<?php

namespace App\Controller;

use App\Entity\BlogPost;
use App\Repository\BlogPostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class BlogPostsController extends AbstractController
{
    private $entityManager;

    private $blogPostRepository;

    private $validator;

    public function __construct(
        EntityManagerInterface $entityManager,
        BlogPostRepository $blogPostRepository,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->blogPostRepository = $blogPostRepository;
        $this->validator = $validator;
    }
    #[Route('/api/posts', name: 'api_posts_index', methods: ['GET'])]
    public function index(Request $request): Response
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 6);

        // Fetch posts sorted by 'created_at' in descending order
        $posts = $this->blogPostRepository->findBy(
            [],
            ['createdAt' => 'DESC'], // Sort by 'created_at' in descending order
            $limit,
            ($page - 1) * $limit
        );

        if (!$posts) {
            return $this->json([
                'posts' => [],
                'page' => $page,
                'limit' => $limit,
                'total' => $this->blogPostRepository->count([]),
            ], Response::HTTP_OK);
        }

        $data = [];
        foreach ($posts as $post) {
            $author = $post->getAuthor();
            $data[] = [
                'id' => $post->getId(),
                'title' => $post->getTitle(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt(),
                'author' => [
                    'id' => $author->getId(),
                    'fullname' => $author->getFullname(),
                    'email' => $author->getEmail(),
                    'username' => $author->getUsername(),
                ],
            ];
        }

        /** @var Serializer $serializer */
        $serializer = new Serializer([new ObjectNormalizer()]);
        $jsonData = $serializer->normalize($data, 'json');

        // Return paginated data along with page info and total count
        return $this->json([
            'posts' => $jsonData,
            'page' => $page,
            'limit' => $limit,
            'total' => $this->blogPostRepository->count([]),
        ], Response::HTTP_OK);
    }

    #[Route('/api/posts/{id}', name: 'api_post_show', methods: ['GET'])]
    public function detail(string $id): Response
    {
        /** @var BlogPost $posts */
        $post = $this->blogPostRepository->find($id);

        if (!$post) {
            return $this->json([], Response::HTTP_NO_CONTENT);
        }

        $author = $post->getAuthor();
        $data = [
            'id' => $post->getId(),
            'title' => $post->getTitle(),
            'content' => $post->getContent(),
            'created_at' => $post->getCreatedAt(),
            'author' => [
                'id' => $author->getId(),
                'fullname' => $author->getFullname(),
                'email' => $author->getEmail(),
                'username' => $author->getUsername(),
            ],
        ];

        /** @var Serializer $serializer */
        $serializer = new Serializer([new ObjectNormalizer()]);
        $jsonData = $serializer->normalize($data, 'json');

        return $this->json($jsonData, Response::HTTP_OK);
    }

    #[Route('/api/posts', name: 'api_post_create', methods: ['POST'])]
    public function create(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        // Validate input data
        if (!isset($data['title']) || !isset($data['content'])) {
            return $this->json(['message' => 'Invalid input data.'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getUser();

        $blogPost = new BlogPost();
        $blogPost->setTitle($data['title']);
        $blogPost->setContent($data['content']);
        $blogPost->setCreatedAt(new \DateTimeImmutable('now')); // Set current date/time
        $blogPost->setAuthor($user);


        // Validate entity
        $errors = $this->validator->validate($blogPost);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['message' => $errorsString], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($blogPost);
        $this->entityManager->flush();

        return $this->json([
            'id' => $blogPost->getId(),
            'title' => $blogPost->getTitle(),
            'content' => $blogPost->getContent(),
            'created_at' => $blogPost->getCreatedAt(),
            'author' => [
                'id' => $user->getId(),
                'fullname' => $user->getFullname(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
            ],
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/posts/{id}', name: 'api_post_edit', methods: ['PUT'])]
    public function edit(Request $request, string $id): Response
    {
        // Retrieve the blog post by ID
        $blogPost = $this->blogPostRepository->find($id);

        if (!$blogPost) {
            return $this->json(['message' => 'Post not found.'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Validate input data
        if (!isset($data['title']) || !isset($data['content'])) {
            return $this->json(['message' => 'Invalid input data.'], Response::HTTP_BAD_REQUEST);
        }

        // Update the blog post
        $blogPost->setTitle($data['title']);
        $blogPost->setContent($data['content']);

        // Validate entity
        $errors = $this->validator->validate($blogPost);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['message' => $errorsString], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $blogPost->getId(),
            'title' => $blogPost->getTitle(),
            'content' => $blogPost->getContent(),
            'created_at' => $blogPost->getCreatedAt(),
            'author' => [
                'id' => $blogPost->getAuthor()->getId(),
                'fullname' => $blogPost->getAuthor()->getFullname(),
                'email' => $blogPost->getAuthor()->getEmail(),
                'username' => $blogPost->getAuthor()->getUsername(),
            ],
        ], Response::HTTP_OK);
    }

    #[Route('/api/posts/{id}', name: 'api_post_delete', methods: ['GET', 'DELETE'])]
    public function delete(string $id): Response
    {
        /** @var BlogPost $post */
        $post = $this->blogPostRepository->find($id);

        if (!$post) {
            return $this->json(['message' => 'Post was not found.'], Response::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($post);
        $this->entityManager->flush();

        return $this->json(['message' => 'Your post has been deleted.'], Response::HTTP_OK);
    }
}
