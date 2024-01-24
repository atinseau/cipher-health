
type MedicIconProps = React.SVGProps<SVGSVGElement>

export default function ChildIcon(props: MedicIconProps) {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g id="child">
      <path id="Vector" d="M32 15.3337C31.9993 14.4142 31.7268 13.5154 31.2169 12.7502C30.7069 11.9849 29.9822 11.3873 29.1337 11.0324C28.5921 7.94227 26.9779 5.14199 24.575 3.12411C22.172 1.10623 19.1342 0 15.9958 0C12.8575 0 9.81968 1.10623 7.41671 3.12411C5.01373 5.14199 3.39951 7.94227 2.85798 11.0324C1.88965 11.4396 1.08703 12.1615 0.579921 13.0812C0.0728084 14.0009 -0.109157 15.0647 0.06345 16.1005C0.236057 17.1364 0.753145 18.0838 1.5311 18.7896C2.30905 19.4953 3.30239 19.9181 4.35049 19.9896C5.03938 21.4509 5.97366 22.7835 7.11277 23.9295C5.44365 25.7513 4.38436 28.0481 4.0824 30.5C4.06054 30.6738 4.07315 30.8502 4.11951 31.0191C4.16587 31.188 4.24507 31.3462 4.35258 31.4845C4.4601 31.6228 4.59382 31.7385 4.74611 31.8252C4.8984 31.9118 5.06627 31.9676 5.24013 31.9893C5.29501 31.996 5.35023 31.9996 5.40552 32C5.73012 31.9996 6.04345 31.8809 6.28678 31.6662C6.5301 31.4514 6.68673 31.1553 6.72731 30.8334C6.96913 28.9003 7.8165 27.0932 9.14814 25.6708C11.1343 27.1364 13.5263 27.9502 15.9945 28.0001C18.4554 27.9497 20.8404 27.1393 22.8222 25.6801C24.148 27.1001 24.9919 28.902 25.2337 30.8294C25.2739 31.1515 25.4304 31.448 25.6738 31.663C25.9172 31.878 26.2307 31.9969 26.5555 31.9973C26.6112 31.9971 26.6669 31.9935 26.7222 31.9867C27.0731 31.9427 27.3921 31.7613 27.6092 31.4823C27.8263 31.2032 27.9237 30.8495 27.8799 30.4987C27.5801 28.053 26.5261 25.7612 24.8642 23.9415C26.0096 22.792 26.9489 21.4544 27.6412 19.9869C28.8226 19.9084 29.93 19.3842 30.7393 18.5202C31.5486 17.6563 31.9992 16.5172 32 15.3337ZM26.9956 17.2976C26.6845 17.2406 26.3633 17.2968 26.09 17.456C25.8168 17.6152 25.6095 17.8669 25.5058 18.1656C24.284 21.6295 20.1693 25.3335 15.9945 25.3335C11.8197 25.3335 7.70498 21.6269 6.48322 18.1629C6.37924 17.8644 6.17195 17.6129 5.89875 17.4537C5.62556 17.2946 5.30446 17.2383 4.99338 17.2949C4.88253 17.3167 4.77015 17.3296 4.65726 17.3336C4.16214 17.3277 3.6868 17.1385 3.32318 16.8025C2.95956 16.4665 2.73349 16.0077 2.68869 15.5147C2.64389 15.0218 2.78354 14.5298 3.08065 14.1338C3.37775 13.7378 3.81119 13.466 4.29714 13.371C4.58072 13.3196 4.84003 13.1778 5.03623 12.9668C5.23243 12.7557 5.35497 12.4869 5.38551 12.2004C5.56365 10.4955 6.15218 8.85909 7.1008 7.43111C8.04942 6.00313 9.32989 4.82605 10.8327 4.00053C10.6143 4.84865 10.6043 5.73697 10.8034 6.58982C11.0745 7.71765 11.7062 8.72637 12.6025 9.46305C13.4988 10.1997 14.6109 10.6242 15.7703 10.6722C16.9297 10.7201 18.0731 10.3889 19.0272 9.7287C19.9814 9.06853 20.6941 8.11541 21.0576 7.01381C21.1168 6.81812 21.1292 6.61123 21.0936 6.40989C21.058 6.20855 20.9756 6.0184 20.8528 5.85483C20.7301 5.69126 20.5706 5.55887 20.3872 5.46836C20.2038 5.37785 20.0017 5.33177 19.7971 5.33384H19.5957C19.3504 5.34188 19.114 5.42773 18.9208 5.57898C18.7275 5.73023 18.5874 5.93903 18.5207 6.17516C18.3657 6.6413 18.0848 7.05557 17.7092 7.37227C17.3335 7.68897 16.8777 7.89579 16.3919 7.96992C15.9061 8.04404 15.4093 7.98259 14.9562 7.79235C14.5032 7.6021 14.1115 7.29045 13.8244 6.89178C13.5373 6.49311 13.3659 6.02291 13.3292 5.53305C13.2925 5.0432 13.3919 4.55272 13.6164 4.11574C13.8408 3.67876 14.1817 3.31225 14.6013 3.05664C15.021 2.80104 15.5031 2.66628 15.9945 2.66722C18.6298 2.66092 21.1738 3.63241 23.1337 5.39356C25.0936 7.1547 26.33 9.58021 26.6035 12.2004C26.634 12.4869 26.7566 12.7557 26.9528 12.9668C27.149 13.1778 27.4083 13.3196 27.6919 13.371C28.1778 13.466 28.6112 13.7378 28.9083 14.1338C29.2054 14.5298 29.3451 15.0218 29.3003 15.5147C29.2555 16.0077 29.0294 16.4665 28.6658 16.8025C28.3022 17.1385 27.8268 17.3277 27.3317 17.3336C27.2189 17.3305 27.1065 17.3184 26.9956 17.2976Z" fill="#7556F4" />
      <path id="Vector_2" d="M12.6601 17.3339C13.7651 17.3339 14.6608 16.4385 14.6608 15.3339C14.6608 14.2294 13.7651 13.334 12.6601 13.334C11.5552 13.334 10.6594 14.2294 10.6594 15.3339C10.6594 16.4385 11.5552 17.3339 12.6601 17.3339Z" fill="#7556F4" />
      <path id="Vector_3" d="M19.3289 17.3339C20.4339 17.3339 21.3296 16.4385 21.3296 15.3339C21.3296 14.2294 20.4339 13.334 19.3289 13.334C18.224 13.334 17.3282 14.2294 17.3282 15.3339C17.3282 16.4385 18.224 17.3339 19.3289 17.3339Z" fill="#7556F4" />
    </g>
  </svg>
}