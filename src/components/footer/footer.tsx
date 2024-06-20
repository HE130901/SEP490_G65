import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col">
      <footer className="bg-stone-100 py-8 dark:bg-gray-800 mt-auto">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-bold">An Bình Viên</span>
          </Link>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4">
              <LocateIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="font-semibold">Địa chỉ</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  123 Main St, Anytown USA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="font-semibold">Số điện thoại</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  (555) 555-5555
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MailIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  info@abv.com
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2024 ABV Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LocateIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
