<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\BlogPost;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordHasherInterface
     */
    private $passwordHasher;

    /**
     * constructor
     *
     * @param UserPasswordHasherInterface $passwordHasher
     */
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $this->loadUsers($manager);
        $this->loadPosts($manager);
    }

    /**
     * Fixtures data for users.
     *
     * @param ObjectManager $manager
     */
    private function loadUsers(ObjectManager $manager)
    {
        $user1 = new User();
        $user1->setUsername('user1');
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'demo'));
        $user1->setFullName('User1 Demo');
        $user1->setEmail('user1@example.com');
        $user1->setRoles(['ROLE_USER']);
        $manager->persist($user1);


        $user2 = new User();
        $user2->setUsername('user2');
        $user2->setPassword($this->passwordHasher->hashPassword($user2, 'demo'));
        $user2->setFullName('User2 Demo');
        $user2->setEmail('user2@example.com');
        $user2->setRoles(['ROLE_USER']);
        $manager->persist($user2);

        $manager->flush();

        $this->addReference('user_1', $user1);
        $this->addReference('user_2', $user2);
    }

    /**
     * Fixtures data for posts.
     *
     * @param ObjectManager $manager
     */
    private function loadPosts(ObjectManager $manager)
    {
        $post1 = new BlogPost();
        $post1->setTitle('Post 1');
        $post1->setContent('This is the first post.');
        $post1->setCreatedAt(new \DateTimeImmutable('2021-01-01 12:00:00'));
        $post1->setAuthor($this->getReference('user_1'));
        $manager->persist($post1);

        $post2 = new BlogPost();
        $post2->setTitle('Post 2');
        $post2->setContent('This is the second post.');
        $post2->setCreatedAt(new \DateTimeImmutable('2021-01-02 12:00:00'));
        $post2->setAuthor($this->getReference('user_2'));
        $manager->persist($post2);

        $manager->flush();
    }
}
